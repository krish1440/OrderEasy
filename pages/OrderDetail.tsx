import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Order, Delivery } from '../types';
import { ArrowLeft, Trash2, Truck, Plus, Save, Download, FileText, Upload, Calendar, DollarSign, Package, Edit2, X, CheckCircle, AlertCircle } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { DynamicFieldsInput, CustomField } from '../components/DynamicFieldsInput';
import OrderDetailSkeleton from '../components/skeletons/OrderDetailSkeleton';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editCustomFields, setEditCustomFields] = useState<CustomField[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Delivery State
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    delivery_quantity: 0,
    total_amount_received: 0,
    delivery_date: new Date().toISOString().split('T')[0]
  });
  const [deliveryCustomFields, setDeliveryCustomFields] = useState<CustomField[]>([]);

  const normalizeNumericInput = (value: string) => value.replace(/^0+(?=\d)/, '');

  const clearIfZero = (field: string, isDelivery = false) => {
    if (isDelivery) {
      const val = (newDelivery as any)[field];
      if (val === 0) {
        setNewDelivery({ ...newDelivery, [field]: '' } as any);
      }
    } else {
      const val = (editFormData as any)[field];
      if (val === 0) {
        setEditFormData({ ...editFormData, [field]: '' });
      }
    }
  };

  const resetIfEmpty = (field: string, isDelivery = false) => {
    if (isDelivery) {
      const val = (newDelivery as any)[field];
      if (val === '') {
        setNewDelivery({ ...newDelivery, [field]: 0 } as any);
      }
    } else {
      const val = (editFormData as any)[field];
      if (val === '') {
        setEditFormData({ ...editFormData, [field]: 0 });
      }
    }
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete_order' | 'delete_delivery' | null;
    targetId?: number;
  }>({
    isOpen: false,
    type: null
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [orderData, deliveryData] = await Promise.all([
        api.get<Order>(`/orders/${id}`),
        api.get<Delivery[]>(`/deliveries/${id}`)
      ]);
      setOrder(orderData);
      setDeliveries(deliveryData);
    } catch (e) {
      console.error(e);
      // navigate('/orders');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Deletion Logic with Modal ---
  const requestDeleteOrder = () => {
    setConfirmModal({
      isOpen: true,
      type: 'delete_order'
    });
  };

  const requestDeleteDelivery = (deliveryId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete_delivery',
      targetId: deliveryId
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.type) return;

    try {
      if (confirmModal.type === 'delete_order') {
        await api.delete(`/orders/${id}`);
        navigate('/orders');
      }
      else if (confirmModal.type === 'delete_delivery' && confirmModal.targetId) {
        await api.delete(`/deliveries/${id}/${confirmModal.targetId}`);
        fetchData();
        showNotification("Delivery deleted successfully");
      }
    } catch (e: any) {
      showNotification(e.message || "Operation failed", 'error');
    } finally {
      setConfirmModal({ isOpen: false, type: null }); // Close modal
    }
  };
  // ---------------------------------

  const openEditModal = () => {
    if (order) {
      setEditFormData({
        receiver_name: order.receiver_name,
        date: order.date,
        expected_delivery_date: order.expected_delivery_date || '',
        product: order.product,
        description: order.description || '',
        quantity: order.quantity,
        price: order.price,
        gst: order.gst,
        advance_payment: order.advance_payment,
        url: order.url
      });

      const initialCustomFields: CustomField[] = [];
      if (order.custom_data) {
        Object.entries(order.custom_data).forEach(([key, value]) => {
          initialCustomFields.push({ key, value });
        });
      }
      setEditCustomFields(initialCustomFields);

      setIsEditModalOpen(true);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const customDataPayload: Record<string, string> = {};
      editCustomFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          customDataPayload[field.key.trim()] = field.value.trim();
        }
      });

      await api.put(`/orders/${id}`, {
        ...editFormData,
        quantity: Number(editFormData.quantity),
        price: Number(editFormData.price),
        gst: Number(editFormData.gst),
        advance_payment: Number(editFormData.advance_payment),
        custom_data: customDataPayload
      });
      setIsEditModalOpen(false);
      fetchData();
      showNotification("Order updated successfully!");
    } catch (err: any) {
      showNotification("Update failed: " + err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fileData = {};

      // Upload Proof if exists
      if (deliveryFile) {
        const uploadRes = await api.upload('/upload/', deliveryFile);
        fileData = {
          public_id: uploadRes.public_id,
          url: uploadRes.url,
          file_name: uploadRes.file_name,
          resource_type: uploadRes.resource_type
        };
      }

      const customDataPayload: Record<string, string> = {};
      deliveryCustomFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          customDataPayload[field.key.trim()] = field.value.trim();
        }
      });

      await api.post('/deliveries/', {
        order_id: Number(id),
        ...newDelivery,
        ...fileData,
        custom_data: customDataPayload
      });

      setShowAddDelivery(false);
      setDeliveryFile(null);
      fetchData();
      setNewDelivery({
        delivery_quantity: 0,
        total_amount_received: 0,
        delivery_date: new Date().toISOString().split('T')[0]
      });
      setDeliveryCustomFields([]);
      showNotification("Delivery added successfully!");
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // Helper to detect file type from magic bytes
  const getExtensionFromBytes = async (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arr = (new Uint8Array(reader.result as ArrayBuffer)).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        // Check magic bytes
        if (header.startsWith("25504446")) resolve(".pdf"); // %PDF
        else if (header.startsWith("89504e47")) resolve(".png"); // PNG
        else if (header.startsWith("ffd8ff")) resolve(".jpg"); // JPG
        else if (header.startsWith("504b0304")) resolve(".xlsx"); // ZIP/XLSX
        else resolve(""); // Unknown
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // 1. Try to open directly if it clearly has an extension (and isn't a weird raw url)
      const hasExt = /\.(pdf|jpg|jpeg|png|xlsx|docx)$/i.test(url);
      const isRaw = url.includes("/raw/");

      if (hasExt && !isRaw) {
        window.open(url, '_blank');
        return;
      }

      // 2. Fetch blob
      const response = await fetch(url);
      const blob = await response.blob();

      // 3. Determine extension
      let ext = "";

      // A. Trust MIME type if specific
      if (blob.type === 'application/pdf') ext = '.pdf';
      else if (blob.type === 'image/jpeg') ext = '.jpg';
      else if (blob.type === 'image/png') ext = '.png';

      // B. If generic or raw, check magic bytes
      if (!ext) {
        ext = await getExtensionFromBytes(blob);
      }

      // C. Fallback for legacy "delivery_" files that are likely PDF
      if (!ext && url.includes("delivery_")) {
        ext = ".pdf";
      }

      // 4. Create proper filename
      const finalFilename = filename.includes('.') ? filename : `${filename}${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

    } catch (e) {
      console.error("Download failed, falling back to window.open", e);
      window.open(url, '_blank');
    }
  };

  const handleExportDeliveries = async () => {
    if (deliveries.length === 0) {
      showNotification("No deliveries recorded to export.", 'error');
      return;
    }
    try {
      await api.download(`/exports/deliveries/${id}`, `order_${id}_deliveries.xlsx`);
      showNotification("Export started successfully!");
    } catch (e: any) {
      showNotification("Export failed: " + (e.message || "Unknown error"), 'error');
    }
  };

  // E-Way Bill Upload Logic (Mock-ish: assuming PUT endpoint updates order url)
  // Backend support needed: PUT /orders/{id} with url.
  // Assuming generic update endpoint exists or we rely on deliveries.
  const handleUploadEWayBill = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setUploading(true);
        const res = await api.upload('/upload/', file);
        // Update Order with URL
        await api.put(`/orders/${id}`, { url: res.url });
        fetchData();
        showNotification("E-Way Bill uploaded!");
      } catch (err: any) {
        showNotification("Upload failed: " + err.message, 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading || !order) return <OrderDetailSkeleton />;

  const remainingQty = order.quantity - order.delivered_quantity;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right fade-in ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'delete_order' ? "Delete Order?" : "Delete Delivery?"}
        message={confirmModal.type === 'delete_order'
          ? "Are you sure you want to delete this order? This action cannot be undone and will delete all associated delivery records."
          : "Are you sure you want to delete this delivery record? Stocks will be adjusted accordingly."}
        isDangerous={true}
        confirmText="Yes, Delete"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null })}
      />

      <button onClick={() => navigate('/orders')} className="flex items-center text-slate-500 hover:text-brand-600 gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Order #{order.order_id}</h1>
              <span className={`px-2.5 py-0.5 text-sm rounded-full font-medium ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-slate-500 mt-1">Customer: <span className="font-medium text-slate-800">{order.receiver_name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 text-slate-600 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors font-medium border border-slate-200"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            {order.url ? (
              <button
                onClick={() => handleDownload(order.url!, `EWayBill-${order.order_id}`)}
                className="flex items-center gap-2 text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition-colors font-medium border border-brand-200"
              >
                <FileText className="w-4 h-4" />
                View E-Way Bill
              </button>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  onChange={handleUploadEWayBill}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <button
                  className="flex items-center gap-2 text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors font-medium border border-slate-200"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload E-Way Bill'}
                </button>
              </div>
            )}
            <button onClick={requestDeleteOrder} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors border border-transparent hover:border-rose-200">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          {/* Row 1 */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <p className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1"><Package className="w-3 h-3" /> Product</p>
            <p className="font-medium text-slate-800 text-lg truncate" title={order.product}>{order.product}</p>
            {order.description && <p className="text-xs text-slate-500 mt-1">{order.description}</p>}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" /> Order Date</p>
            <p className="font-medium text-slate-800">{order.date}</p>
            <p className="text-xs text-slate-400">Exp: {order.expected_delivery_date}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1"><DollarSign className="w-3 h-3" /> Total Value</p>
            <p className="font-bold text-slate-800">₹{order.total_amount_with_gst.toLocaleString()}</p>
            <p className="text-xs text-slate-400">GST: ₹{order.gst.toLocaleString()} ({((order.gst / order.basic_price) * 100).toFixed(0)}%)</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Pending Amt</p>
            <p className={`font-bold ${order.pending_amount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>₹{order.pending_amount.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Adv: ₹{order.advance_payment.toLocaleString()}</p>
          </div>

          {/* Row 2 */}
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Qty</p>
            <p className="font-medium text-slate-800">{order.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Delivered</p>
            <p className="font-medium text-emerald-600">{order.delivered_quantity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Remaining</p>
            <p className={`font-medium ${remainingQty > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{remainingQty}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-400 uppercase font-semibold">Delivery Progress</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${remainingQty === 0 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                  style={{ width: `${Math.min((order.delivered_quantity / order.quantity) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{Math.round((order.delivered_quantity / order.quantity) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Custom Data View Section */}
        {order.custom_data && Object.keys(order.custom_data).length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(order.custom_data).map(([key, value]) => (
                <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{key}</p>
                  <p className="font-medium text-slate-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deliveries Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-400" />
            Delivery History
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportDeliveries}
              className="flex items-center gap-2 text-slate-600 font-medium hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button
              onClick={() => setShowAddDelivery(!showAddDelivery)}
              className="flex items-center gap-2 bg-brand-600 text-white font-medium hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Delivery
            </button>
          </div>
        </div>

        {/* Add Delivery Form */}
        {showAddDelivery && (
          <div className="bg-brand-50/50 border border-brand-100 p-4 rounded-lg animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-brand-800 mb-3 text-sm">New Delivery Record</h3>
            <form onSubmit={handleAddDelivery} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Date</label>
                  <input required type="date" className="w-full p-2 border border-slate-200 rounded-md bg-white text-sm"
                    value={newDelivery.delivery_date} onChange={e => setNewDelivery({ ...newDelivery, delivery_date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Quantity</label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border border-slate-200 rounded-md bg-white text-sm"
                      value={newDelivery.delivery_quantity}
                      onFocus={() => clearIfZero('delivery_quantity', true)}
                      onBlur={() => resetIfEmpty('delivery_quantity', true)}
                      onChange={e => setNewDelivery({ ...newDelivery, delivery_quantity: Number(normalizeNumericInput(e.target.value)) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Amount Received (₹)</label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border border-slate-200 rounded-md bg-white text-sm"
                      value={newDelivery.total_amount_received}
                      onFocus={() => clearIfZero('total_amount_received', true)}
                      onBlur={() => resetIfEmpty('total_amount_received', true)}
                      onChange={e => setNewDelivery({ ...newDelivery, total_amount_received: Number(normalizeNumericInput(e.target.value)) })}
                    />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Proof (Optional)</label>
                  <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    onChange={e => setDeliveryFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
              </div>

              <div className="border-t border-brand-100 pt-3 mt-1">
                <DynamicFieldsInput fields={deliveryCustomFields} onChange={setDeliveryCustomFields} />
              </div>

              <div className="flex justify-end gap-2 pr-4">
                <button type="button" onClick={() => setShowAddDelivery(false)} className="text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Deliveries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Qty Delivered</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount Received</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase min-w-[150px]">Details</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Proof</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No deliveries recorded yet.</td></tr>
              ) : (
                deliveries.map(d => (
                  <tr key={d.delivery_id}>
                    <td className="px-6 py-3 text-sm text-slate-500">#{d.delivery_id}</td>
                    <td className="px-6 py-3 text-sm text-slate-900">{d.delivery_date}</td>
                    <td className="px-6 py-3 text-sm text-slate-900">{d.delivery_quantity}</td>
                    <td className="px-6 py-3 text-sm text-slate-900">₹{d.total_amount_received.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {d.custom_data && Object.keys(d.custom_data).length > 0 ? (
                        <div className="max-h-24 overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                          {Object.entries(d.custom_data).map(([key, val]) => (
                            <div key={key} className="flex flex-col bg-slate-50 rounded px-2 py-1 border border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight">{key}</span>
                              <span className="text-xs font-medium text-slate-700 leading-tight mt-0.5">{val}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs px-2">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {d.url ? (
                        <button
                          onClick={() => handleDownload(d.url!, d.file_name || `Proof-${d.delivery_id}`)}
                          className="text-brand-600 hover:text-brand-800 hover:underline text-xs flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      ) : <span className="text-slate-400 text-xs">-</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => requestDeleteDelivery(d.delivery_id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Edit Order</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                disabled={isUpdating}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-slate-700 pb-2 border-b border-slate-100">Basic Information</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Receiver Name</label>
                  <input required type="text" className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.receiver_name} onChange={e => setEditFormData({ ...editFormData, receiver_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Order Date</label>
                  <input required type="date" className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.date} onChange={e => setEditFormData({ ...editFormData, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Expected Delivery</label>
                  <input type="date" className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.expected_delivery_date} onChange={e => setEditFormData({ ...editFormData, expected_delivery_date: e.target.value })} />
                </div>

                {/* Product Info */}
                <div className="space-y-4 md:col-span-2 mt-2">
                  <h3 className="font-semibold text-slate-700 pb-2 border-b border-slate-100">Product Details</h3>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Product Name</label>
                  <input required type="text" className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.product} onChange={e => setEditFormData({ ...editFormData, product: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea className="w-full border border-slate-200 p-2 rounded-lg h-24"
                    value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} />
                </div>

                {/* Financials */}
                <div className="space-y-4 md:col-span-2 mt-2">
                  <h3 className="font-semibold text-slate-700 pb-2 border-b border-slate-100">Financials</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Quantity</label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.quantity}
                    onFocus={() => clearIfZero('quantity')}
                    onBlur={() => resetIfEmpty('quantity')}
                    onChange={e => setEditFormData({ ...editFormData, quantity: normalizeNumericInput(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Unit Price (₹)</label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.price}
                    onFocus={() => clearIfZero('price')}
                    onBlur={() => resetIfEmpty('price')}
                    onChange={e => setEditFormData({ ...editFormData, price: normalizeNumericInput(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">GST %</label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.gst}
                    onFocus={() => clearIfZero('gst')}
                    onBlur={() => resetIfEmpty('gst')}
                    onChange={e => setEditFormData({ ...editFormData, gst: normalizeNumericInput(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Advance Payment (₹)</label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-200 p-2 rounded-lg"
                    value={editFormData.advance_payment}
                    onFocus={() => clearIfZero('advance_payment')}
                    onBlur={() => resetIfEmpty('advance_payment')}
                    onChange={e => setEditFormData({ ...editFormData, advance_payment: normalizeNumericInput(e.target.value) })}
                  />
                </div>

                {/* Dynamic Fields */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-4">
                  <DynamicFieldsInput fields={editCustomFields} onChange={setEditCustomFields} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm shadow-brand-200 transition-all flex items-center gap-2"
                  disabled={isUpdating}
                >
                  {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;