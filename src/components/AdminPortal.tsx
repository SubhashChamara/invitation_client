"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Copy, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search,
  ExternalLink,
  Loader2,
  ChevronRight,
  TrendingUp,
  Mail,
  Calendar,
  Contact,
  Briefcase,
  Smartphone,
  Phone,
  Wallet,
  LogOut,
  LayoutDashboard,
  QrCode,
  Download,
  Settings,
  DollarSign,
  PieChart,
  ImageUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { API_BASE_URL } from "@/lib/constants";

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  paidTo: string | null;
  paymentMethod: string;
  receiptUrl: string | null;
  paidBy: string;
  date: string;
};

type Vendor = {
  id: string;
  name: string;
  role: string;
  phoneNumber: string | null;
  note: string | null;
};

type Invitee = {
  id: string;
  name: string;
  tableName: string;
  sheetDetail: string;
  rsvpStatus: string | null;
  guestCount: number | null;
  rsvpMessage: string | null;
  phoneNumber: string | null;
};

const DEFAULT_BUDGETS: Record<string, number> = {
  "Venue": 600000,
  "Catering": 700000,
  "Decor": 250000,
  "Photography": 150000,
  "Attire": 100000,
  "Jewelry": 100000,
  "Salon": 50000,
  "Transport": 20000,
  "Invitations": 10000,
  "Other": 20000
};

export default function AdminPortal() {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(DEFAULT_BUDGETS);
  const [payerBudgets, setPayerBudgets] = useState<Record<string, number>>({
    "Subhash": 1000000,
    "Oshani": 1000000
  });
  const [isEditingBudgets, setIsEditingBudgets] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState(0);
  const [newPayerName, setNewPayerName] = useState("");
  const [newPayerBudget, setNewPayerBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedInvitee, setSelectedInvitee] = useState<Invitee | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [payerFilter, setPayerFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [expandedReceipts, setExpandedReceipts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"guests" | "vendors" | "expenditures" | "thanks">("guests");

  // Thanks Card upload state
  const [thanksFile, setThanksFile] = useState<File | null>(null);
  const [thanksPreview, setThanksPreview] = useState<string | null>(null);
  const [thanksUploading, setThanksUploading] = useState(false);
  const [thanksStatus, setThanksStatus] = useState<"idle" | "success" | "error">("idle");
  const [currentThanksImage, setCurrentThanksImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseFormData, setExpenseFormData] = useState({
    description: "",
    amount: 0,
    category: "",
    paidTo: "",
    paymentMethod: "Cash",
    receiptUrl: "",
    paidBy: "Subhash",
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [vendorFormData, setVendorFormData] = useState({
    name: "",
    role: "",
    phoneNumber: "",
    note: ""
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrColor, setQrColor] = useState("#2c2c2c");
  const [qrTextColor, setQrTextColor] = useState("#c5a059");
  
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const getAuthHeaders = () => {
    const token = getCookie('admin_token');
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };
  
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    router.push("/login");
  };
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tableName: "",
    sheetDetail: "",
    rsvpStatus: "",
    guestCount: 0,
    rsvpMessage: "",
    phoneNumber: ""
  });

  const fetchInvitees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setInvitees(data);
      }
    } catch (error) {
      console.error("Failed to fetch invitees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const fetchCurrentThanksImage = () => {
    fetch(`/api/thanks-image?t=${Date.now()}`)
      .then(res => { if (!res.ok) throw new Error(); return res.blob(); })
      .then(blob => setCurrentThanksImage(URL.createObjectURL(blob)))
      .catch(() => setCurrentThanksImage(null));
  };

  const handleThanksFileSelect = (file: File) => {
    setThanksFile(file);
    setThanksStatus("idle");
    const reader = new FileReader();
    reader.onload = e => setThanksPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleThanksUpload = async () => {
    if (!thanksFile) return;
    setThanksUploading(true);
    setThanksStatus("idle");
    const fd = new FormData();
    fd.append("file", thanksFile);
    try {
      const res = await fetch("/api/thanks-image", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setThanksStatus("success");
      setThanksFile(null);
      setThanksPreview(null);
      fetchCurrentThanksImage();
    } catch {
      setThanksStatus("error");
    } finally {
      setThanksUploading(false);
    }
  };

  useEffect(() => {
    fetchInvitees();
    fetchVendors();
    fetchExpenses();
    fetchCurrentThanksImage();
    
    // Load budgets from localStorage
    const savedBudgets = localStorage.getItem('wedding_category_budgets');
    if (savedBudgets) {
      try {
        setCategoryBudgets(JSON.parse(savedBudgets));
      } catch (e) {
        console.error("Failed to parse saved budgets", e);
      }
    }

    const savedPayerBudgets = localStorage.getItem('wedding_payer_budgets');
    if (savedPayerBudgets) {
      try {
        setPayerBudgets(JSON.parse(savedPayerBudgets));
      } catch (e) {
        console.error("Failed to parse saved payer budgets", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wedding_category_budgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    localStorage.setItem('wedding_payer_budgets', JSON.stringify(payerBudgets));
  }, [payerBudgets]);

  const totalBudget = React.useMemo(() => 
    Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0),
  [categoryBudgets]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = selectedInvitee 
      ? `${API_BASE_URL}/api/invitations/${selectedInvitee.id}`
      : `${API_BASE_URL}/api/invitations`;
    
    const method = selectedInvitee ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsAdding(false);
        setSelectedInvitee(null);
        setFormData({ name: "", tableName: "", sheetDetail: "", rsvpStatus: "", guestCount: 0, rsvpMessage: "", phoneNumber: "" });
        fetchInvitees();
      }
    } catch (error) {
      console.error("Failed to save invitee:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (response.ok) fetchInvitees();
    } catch (error) {
      console.error("Failed to delete invitee:", error);
    }
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/invite/${id}`;
    navigator.clipboard.writeText(link);
    alert("Invitation link copied to clipboard!");
  };

  const shareViaWhatsApp = (inv: Invitee) => {
    // Ensure the phone number is in international format (defaulting to +94 for Sri Lanka if it starts with 0)
    let phone = inv.phoneNumber?.replace(/\D/g, '') || "";
    if (phone.startsWith('0')) {
      phone = '94' + phone.substring(1);
    }
    
    // Use the public domain for the invitation link
    const publicDomain = API_BASE_URL
    const link = `${publicDomain}/invite/${inv.id}`;
    const text = `Hi ${inv.name}, we would love to have you at our wedding! Please view your digital invitation here: ${link}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleMessage = (id: string) => {
    const newSet = new Set(expandedMessages);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedMessages(newSet);
  };

  const toggleReceipt = (id: string) => {
    const newSet = new Set(expandedReceipts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedReceipts(newSet);
  };

  const filteredInvitees = invitees.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "pending" && !inv.rsvpStatus) ||
                         inv.rsvpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invitees.length,
    attending: invitees.filter(inv => inv.rsvpStatus === 'attending').length,
    declined: invitees.filter(inv => inv.rsvpStatus === 'declined').length,
    pending: invitees.filter(inv => !inv.rsvpStatus).length
  };

  const handleVendorSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = selectedInvitee && activeTab === "vendors"; // Temporary reuse of selectedInvitee for logic
    const url = isEdit 
      ? `${API_BASE_URL}/api/vendors/${selectedInvitee.id}`
      : `${API_BASE_URL}/api/vendors`;
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(vendorFormData)
      });
      
      if (response.ok) {
        setIsAdding(false);
        setSelectedInvitee(null);
        setVendorFormData({ name: "", role: "", phoneNumber: "", note: "" });
        fetchVendors();
      }
    } catch (error) {
      console.error("Failed to save vendor:", error);
    }
  };

  const handleVendorDelete = async (id: string) => {
    if (!confirm("Remove this contact?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (response.ok) fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor:", error);
    }
  };

  const handleExpenseSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    let currentReceiptUrl = expenseFormData.receiptUrl;

    if (selectedFile) {
      const fileData = new FormData();
      fileData.append("file", selectedFile);
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/api/files/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getCookie('admin_token')}`
          },
          body: fileData
        });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          currentReceiptUrl = uploadResult.url;
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }

    const isEdit = selectedInvitee && activeTab === "expenditures";
    const url = isEdit 
      ? `${API_BASE_URL}/api/expenses/${selectedInvitee.id}`
      : `${API_BASE_URL}/api/expenses`;
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...expenseFormData,
          receiptUrl: currentReceiptUrl
        })
      });
      
      if (response.ok) {
        setIsAdding(false);
        setSelectedInvitee(null);
        setSelectedFile(null);
        setExpenseFormData({ 
          description: "", 
          amount: 0, 
          category: "", 
          paidTo: "", 
          paymentMethod: "Cash",
          receiptUrl: "",
          paidBy: "Subhash",
          date: new Date().toISOString().split('T')[0] 
        });
        fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExpenseDelete = async (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (response.ok) fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const payerSpent = Object.keys(payerBudgets).reduce((acc, payer) => {
    acc[payer] = expenses.filter(e => e.paidBy === payer).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#faf9f6] p-4 sm:p-8 font-sans text-charcoal">
      {/* Navigation / Tab Switcher */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white/50 p-2 rounded-2xl flex gap-2 w-fit border border-charcoal/5 shadow-sm">
          {[
            { id: "guests", label: "Guest Management", icon: Users },
            { id: "vendors", label: "Vendor Contacts", icon: Contact },
            { id: "expenditures", label: "Expenditures", icon: DollarSign },
            { id: "thanks", label: "Thanks Card", icon: ImageUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                ? "bg-gold text-white shadow-md shadow-gold/20" 
                : "text-charcoal/40 hover:text-charcoal hover:bg-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-charcoal mb-2">
            {activeTab === "guests" ? "Invitation Management" : 
             activeTab === "vendors" ? "Vendor Directory" : 
             activeTab === "thanks" ? "Thanks Card Manager" : 
             "Wedding Expenditures"}
          </h1>
          <p className="text-charcoal/50 text-sm flex items-center gap-2">
            {activeTab === "guests" ? (
              <><Calendar className="w-4 h-4" /> Guest List & RSVP Tracking Dashboard</>
            ) : activeTab === "vendors" ? (
              <><Briefcase className="w-4 h-4" /> Professional Services & Venue Contacts</>
            ) : activeTab === "thanks" ? (
              <><ImageUp className="w-4 h-4" /> Thanks Card Image Configuration</>
            ) : (
              <><PieChart className="w-4 h-4" /> Comprehensive Budget & Spending Tracker</>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === "expenditures" && (
            <button 
              onClick={() => setIsEditingBudgets(true)}
              className="bg-white border border-charcoal/10 hover:bg-charcoal/5 text-charcoal/60 px-6 py-3 rounded-full shadow-sm flex items-center gap-2 transition-all transform active:scale-95 text-sm font-bold"
            >
              <Settings className="w-4 h-4" /> Manage Budget
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="bg-white border border-red-500/10 hover:bg-red-500/5 text-red-500/60 px-6 py-3 rounded-full shadow-sm flex items-center gap-2 transition-all transform active:scale-95 text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          {activeTab !== "thanks" && (
            <button 
              onClick={() => {
                setSelectedInvitee(null);
                if (activeTab === "guests") {
                  setFormData({ name: "", tableName: "", sheetDetail: "", rsvpStatus: "", guestCount: 0, rsvpMessage: "", phoneNumber: "" });
                } else if (activeTab === "vendors") {
                  setVendorFormData({ name: "", role: "", phoneNumber: "", note: "" });
                } else {
                  setExpenseFormData({ 
                    description: "", 
                    amount: 0, 
                    category: "", 
                    paidTo: "", 
                    paymentMethod: "Cash",
                    receiptUrl: "",
                    paidBy: "Subhash",
                    date: new Date().toISOString().split('T')[0] 
                  });
                  setSelectedFile(null);
                }
                setIsAdding(true);
              }}
              className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-full shadow-md flex items-center gap-2 transition-all transform active:scale-95 text-sm font-bold"
            >
              {activeTab === "guests" ? (
                <><UserPlus className="w-5 h-5" /> Create New Invitation</>
              ) : activeTab === "vendors" ? (
                <><Contact className="w-5 h-5" /> Add Professional Contact</>
              ) : (
                <><DollarSign className="w-5 h-5" /> Log Expenditure</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid - Hidden on Vendors */}
      {activeTab === "guests" && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Guests", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Confirmed", value: stats.attending, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
            { label: "Declined", value: stats.declined, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
            { label: "Pending", value: stats.pending, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="bg-white p-6 rounded-[24px] shadow-sm border border-charcoal/5"
            >
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-full flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-charcoal/40 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-serif text-charcoal">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {/* Expense Stats Grid */}
      {activeTab === "expenditures" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[32px] border border-charcoal/5 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-charcoal/40 text-xs uppercase tracking-widest font-bold mb-1">Total Spent</p>
              <h3 className="text-4xl font-serif text-charcoal">Rs.{totalSpent.toLocaleString()}</h3>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gold text-white p-8 rounded-[32px] shadow-lg flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">Total Budget</p>
              <h3 className="text-4xl font-serif">Rs.{totalBudget.toLocaleString()}</h3>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[32px] border border-charcoal/5 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <PieChart className="w-8 h-8" />
            </div>
            <div>
              <p className="text-charcoal/40 text-xs uppercase tracking-widest font-bold mb-1">Categories</p>
              <h3 className="text-4xl font-serif text-charcoal">{new Set(expenses.map(e => e.category)).size}</h3>
            </div>
          </motion.div>
        </div>
      )}

      {/* Budget & Payer Breakdowns */}
      {activeTab === "expenditures" && (
        <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-charcoal/5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <PieChart className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-serif text-charcoal">Category Breakdown</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {Object.entries(categoryBudgets).map(([category, budget], i) => {
                const spent = expenses
                  .filter(e => e.category === category)
                  .reduce((sum, e) => sum + e.amount, 0);
                const percentage = Math.min((spent / budget) * 100, 100);
                const isOverBudget = spent > budget;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={category}
                  >
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-charcoal">{category}</span>
                        <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                          Rs.{spent.toLocaleString()} / Rs.{budget.toLocaleString()}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-gold'}`}>
                        {Math.round((spent / budget) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gold'}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          <div className="flex flex-col gap-6">
            {/* Payer Breakdown */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[32px] border border-charcoal/5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-serif text-charcoal">Payer Breakdown</h4>
              </div>

              <div className="space-y-8">
                {Object.entries(payerBudgets).map(([payer, budget], i) => {
                  const spent = payerSpent[payer] || 0;
                  const percentage = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
                  
                  return (
                    <div key={payer}>
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-charcoal">{payer}</span>
                          <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                            Spent: Rs.{spent.toLocaleString()} / Plan: Rs.{budget.toLocaleString()}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${spent > budget ? 'text-red-500' : 'text-gold'}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="h-3 bg-charcoal/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`h-full rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-rose-500'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Overall Utilization */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gold/5 p-8 rounded-[32px] border border-gold/10 flex flex-col justify-center items-center text-center relative overflow-hidden flex-1"
            >
               <h4 className="text-xl font-serif text-charcoal mb-2">Overall Utilization</h4>
               <div className="text-5xl font-serif text-gold mb-3">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
               </div>
               <p className="text-charcoal/60 text-[11px] leading-relaxed mb-4">
                  Rs.{totalSpent.toLocaleString()} of Rs.{totalBudget.toLocaleString()}
               </p>
               <div className="w-full h-1.5 bg-gold/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
                    className="h-full bg-gold rounded-full"
                  />
               </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeTab !== "thanks" && (
        <div className="max-w-7xl mx-auto bg-white rounded-[32px] shadow-sm border border-charcoal/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-charcoal/5 flex flex-col sm:flex-row justify-between gap-4 bg-[#fcfbf9]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <input 
              type="text" 
              placeholder={activeTab === "guests" ? "Search guests by name..." : "Search contacts by name or role..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "guests" ? (
              <>
                <label className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest whitespace-nowrap">Filter By:</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-charcoal/10 rounded-lg px-3 py-2 text-xs font-bold text-charcoal/60 focus:outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer"
                >
                  <option value="all">All Guests</option>
                  <option value="pending">Pending</option>
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                </select>
              </>
            ) : activeTab === "expenditures" ? (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Payer:</span>
                  <select 
                    value={payerFilter}
                    onChange={(e) => setPayerFilter(e.target.value)}
                    className="bg-white border border-charcoal/10 rounded-lg px-3 py-2 text-xs font-bold text-charcoal/60 focus:outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer"
                  >
                    <option value="all">All Payers</option>
                    {Object.keys(payerBudgets).map(payer => (
                      <option key={payer} value={payer}>{payer}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Cat:</span>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white border border-charcoal/10 rounded-lg px-3 py-2 text-xs font-bold text-charcoal/60 focus:outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer"
                  >
                    <option value="all">All</option>
                    {Object.keys(categoryBudgets).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                {vendors.length} Professional Contacts
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal/40 font-bold uppercase tracking-widest">
            <Mail className="w-4 h-4" /> Ready to share
          </div>
        </div>

        {/* Guest Table */}
        {activeTab === "guests" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fcfbf9]">
                <tr className="text-charcoal/40 text-[11px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-8 py-5">Guest Name</th>
                  <th className="px-6 py-5">Assignment</th>
                  <th className="px-6 py-5">RSVP Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                      <p className="text-charcoal/40 font-serif italic">Loading guest records...</p>
                    </td>
                  </tr>
                ) : filteredInvitees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center text-charcoal/40 font-serif italic">
                      No guests found. Start by creating an invitation.
                    </td>
                  </tr>
                ) : filteredInvitees.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#fcfbf9] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-charcoal">{inv.name}</span>
                        <span className="text-[10px] text-charcoal/30 font-mono flex items-center gap-1">
                          ID: {inv.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-sm">
                        <span className="text-charcoal/80 font-bold">{inv.tableName || "Pending"}</span>
                        <span className="text-charcoal/40">{inv.sheetDetail || "Pending"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                         {inv.rsvpStatus === 'attending' ? (
                           <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                              <CheckCircle2 className="w-3 h-3" /> YES ({inv.guestCount})
                           </div>
                         ) : inv.rsvpStatus === 'declined' ? (
                           <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                              <XCircle className="w-3 h-3" /> NO
                           </div>
                         ) : (
                           <div className="text-charcoal/30 text-xs font-bold tracking-widest uppercase">Pending</div>
                         )}
                      </div>
                      {inv.rsvpMessage && (
                        <div className="flex flex-col items-start">
                          <button 
                            onClick={() => toggleMessage(inv.id)}
                            className="text-[11px] text-gold font-bold uppercase tracking-widest mt-3 hover:text-gold-light transition-colors underline underline-offset-4 decoration-gold/30"
                          >
                            {expandedMessages.has(inv.id) ? "Hide Message" : "View Message"}
                          </button>
                          {expandedMessages.has(inv.id) && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-charcoal bg-[#faf9f6]/80 border border-gold/20 p-3 rounded-xl max-w-sm shadow-sm relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-gold/30" />
                              <p className="font-serif leading-relaxed italic">"{inv.rsvpMessage}"</p>
                            </motion.div>
                          )}
                        </div>
                      )}
  
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyLink(inv.id)}
                          title="Copy Invitation Link"
                          className="p-2 hover:bg-gold/10 text-gold rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {inv.phoneNumber && (
                          <button 
                            onClick={() => shareViaWhatsApp(inv)}
                            title="Share via WhatsApp"
                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(`/invite/${inv.id}`, '_blank')}
                          title="Preview Invitation"
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => {
                             setSelectedInvitee(inv);
                              setFormData({ 
                                name: inv.name, 
                                tableName: inv.tableName, 
                                sheetDetail: inv.sheetDetail,
                                rsvpStatus: inv.rsvpStatus || "",
                                guestCount: inv.guestCount || 0,
                                rsvpMessage: inv.rsvpMessage || "",
                                phoneNumber: inv.phoneNumber || ""
                              });
                             setIsAdding(true);
                           }}
                           title="Edit Guest"
                           className="p-2 hover:bg-charcoal/10 text-charcoal/60 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv.id)}
                          title="Delete Invitation"
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendor List */}
        {activeTab === "vendors" && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#fcfbf9]">
            {loading ? (
              <div className="col-span-full py-32 text-center">
                <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                <p className="text-charcoal/40 font-serif italic">Loading directory...</p>
              </div>
            ) : vendors.filter(v => 
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                v.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 ? (
              <div className="col-span-full py-32 text-center text-charcoal/40 font-serif italic">
                No professional contacts found. Add your coordination team here.
              </div>
            ) : vendors.filter(v => 
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                v.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((vendor) => (
              <motion.div 
                layout
                key={vendor.id}
                className="bg-white p-6 rounded-[24px] border border-charcoal/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedInvitee({ id: vendor.id } as any); // Reuse for editing logic
                      setVendorFormData({
                        name: vendor.name,
                        role: vendor.role,
                        phoneNumber: vendor.phoneNumber || "",
                        note: vendor.note || ""
                      });
                      setIsAdding(true);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleVendorDelete(vendor.id)}
                    className="p-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold flex-shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-serif text-xl mb-1">{vendor.name}</h4>
                      <span className="text-[10px] bg-charcoal/5 text-charcoal/60 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        {vendor.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-auto">
                    <button 
                      onClick={() => window.open(`tel:${vendor.phoneNumber}`)}
                      className="flex items-center gap-3 w-full p-3 bg-[#faf9f6] rounded-xl hover:bg-gold/5 transition-colors group/btn"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-charcoal/40 group-hover/btn:text-gold transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-charcoal/80">{vendor.phoneNumber || "No Phone"}</span>
                    </button>
                    
                    {vendor.note && (
                      <div className="p-4 bg-charcoal/5 rounded-xl border border-charcoal/5">
                        <p className="text-xs text-charcoal/60 italic leading-relaxed">
                          {vendor.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Expense Table */}
        {activeTab === "expenditures" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fcfbf9]">
                <tr className="text-charcoal/40 text-[11px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5 text-center">Payer</th>
                  <th className="px-6 py-5 text-center">Receipt</th>
                  <th className="px-6 py-5 text-right">Category</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                      <p className="text-charcoal/40 font-serif italic">Calculating ledger...</p>
                    </td>
                  </tr>
                ) : expenses.filter(e => {
                  const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesPayer = payerFilter === "all" || e.paidBy === payerFilter;
                  const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
                  return matchesSearch && matchesPayer && matchesCategory;
                }).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-32 text-center text-charcoal/40 font-serif italic">
                      No expenditures found matching your selection.
                    </td>
                  </tr>
                ) : expenses.filter(e => {
                  const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesPayer = payerFilter === "all" || e.paidBy === payerFilter;
                  const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
                  return matchesSearch && matchesPayer && matchesCategory;
                }).map((exp) => (
                  <React.Fragment key={exp.id}>
                    <tr className="hover:bg-[#fcfbf9] transition-colors group">
                    <td className="px-8 py-5 text-sm font-mono text-charcoal/40">{exp.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-charcoal">{exp.description}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {exp.paidTo && (
                            <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                              To: {exp.paidTo}
                            </span>
                          )}
                          <span className="text-[10px] text-gold/60 font-bold uppercase tracking-widest">• {exp.paymentMethod}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-bold text-charcoal/60 px-2 py-1 bg-charcoal/5 rounded-md uppercase tracking-widest leading-none">
                        {exp.paidBy || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        {exp.receiptUrl ? (
                          <>
                            {exp.receiptUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-charcoal/5 flex-shrink-0 bg-white">
                                <img src={exp.receiptUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <button 
                              onClick={() => toggleReceipt(exp.id)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                expandedReceipts.has(exp.id) 
                                ? "bg-gold text-white shadow-sm" 
                                : "bg-gold/10 text-gold hover:bg-gold/20"
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5" /> 
                              {expandedReceipts.has(exp.id) ? "Close" : "View"}
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-charcoal/20 font-bold uppercase">No Doc</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          exp.category === 'Venue' ? 'bg-blue-50 text-blue-600' :
                          exp.category === 'Catering' ? 'bg-amber-50 text-amber-600' :
                          exp.category === 'Decor' ? 'bg-purple-50 text-purple-600' :
                          exp.category === 'Photography' ? 'bg-indigo-50 text-indigo-600' :
                          exp.category === 'Attire' ? 'bg-rose-50 text-rose-600' :
                          exp.category === 'Jewelry' ? 'bg-emerald-50 text-emerald-600' :
                          exp.category === 'Salon' ? 'bg-pink-50 text-pink-600' :
                          exp.category === 'Transport' ? 'bg-orange-50 text-orange-600' :
                          exp.category === 'Invitations' ? 'bg-cyan-50 text-cyan-600' :
                          'bg-gold/10 text-gold'
                        }`}>{exp.category}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-charcoal">Rs.{exp.amount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => {
                           setSelectedInvitee({ id: exp.id } as any);
                             setExpenseFormData({
                               description: exp.description,
                               amount: exp.amount,
                               category: exp.category,
                               paidTo: exp.paidTo || "",
                               paymentMethod: exp.paymentMethod || "Cash",
                               receiptUrl: exp.receiptUrl || "",
                               paidBy: exp.paidBy || "Subhash",
                               date: exp.date
                             });
                             setSelectedFile(null);
                             setIsAdding(true);
                           }}
                           className="p-2 hover:bg-gold/10 text-gold rounded-lg transition-colors"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleExpenseDelete(exp.id)}
                           className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                  {expandedReceipts.has(exp.id) && exp.receiptUrl && (
                    <tr className="bg-[#faf9f6]/50">
                      <td colSpan={6} className="px-8 py-6">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative max-w-2xl mx-auto bg-white rounded-2xl border border-charcoal/5 shadow-lg overflow-hidden"
                        >
                          <div className="p-4 border-b border-charcoal/5 flex justify-between items-center bg-white">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Reference Document Preview</span>
                            <button 
                              onClick={() => window.open(exp.receiptUrl!, '_blank')}
                              className="text-[10px] text-gold hover:text-gold-light font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> External Link
                            </button>
                          </div>
                          <div className="p-2 bg-[#fcfbf9] min-h-[300px] flex items-center justify-center">
                            {exp.receiptUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                              <img src={exp.receiptUrl} alt="Receipt" className="max-w-full h-auto rounded-lg" />
                            ) : (
                              <iframe src={exp.receiptUrl} className="w-full h-[500px] border-0 rounded-lg" />
                            )}
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {expenses.filter(e => {
                  const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesPayer = payerFilter === "all" || e.paidBy === payerFilter;
                  const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
                  return matchesSearch && matchesPayer && matchesCategory;
                }).length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center text-charcoal/40 font-serif italic">
                    No records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-8 sm:p-10 pb-4 border-b border-charcoal/5 flex justify-between items-center">
                <h2 className="text-3xl font-serif text-charcoal">
                  {activeTab === "guests" 
                    ? (selectedInvitee ? "Edit Guest" : "Add New Guest")
                    : activeTab === "vendors"
                    ? (selectedInvitee ? "Edit Contact" : "Add Professional")
                    : (selectedInvitee ? "Edit Expenditure" : "Log New Expenditure")
                  }
                </h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-charcoal/5 rounded-full text-charcoal/40 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 sm:p-10 pt-6 custom-scrollbar">

            {/* Guest Form Content */}
            {activeTab === "guests" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Guest Name"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="e.g. +919876543210"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Table No.</label>
                    <input 
                      type="text" 
                      value={formData.tableName}
                      onChange={(e) => setFormData({...formData, tableName: e.target.value})}
                      placeholder="e.g. Table 05"
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Seat No.</label>
                    <input 
                      type="text" 
                      value={formData.sheetDetail}
                      onChange={(e) => setFormData({...formData, sheetDetail: e.target.value})}
                      placeholder="e.g. Seat A1"
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
                
                <div className="h-px w-full bg-charcoal/5 my-2" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">RSVP Status</label>
                    <select 
                      value={formData.rsvpStatus}
                      onChange={(e) => setFormData({...formData, rsvpStatus: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="">Pending</option>
                      <option value="attending">Attending</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  {formData.rsvpStatus === 'attending' && (
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Guest Count</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({...formData, guestCount: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">RSVP Message</label>
                  <textarea 
                    value={formData.rsvpMessage}
                    onChange={(e) => setFormData({...formData, rsvpMessage: e.target.value})}
                    placeholder="Message from guest..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
                  />
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-light text-white font-bold py-4 rounded-full shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                  >
                    {selectedInvitee ? "Update Guest" : "Add to List"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="w-full text-charcoal/40 font-bold py-2 text-[10px] uppercase tracking-[0.2em] hover:text-charcoal transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Vendor Form Content */}
            {activeTab === "vendors" && (
              <form onSubmit={handleVendorSave} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Service / Role</label>
                  <select 
                    required
                    value={vendorFormData.role}
                    onChange={(e) => setVendorFormData({...vendorFormData, role: e.target.value})}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">Select Category</option>
                    <option value="Event Coordinator">Event Coordinator</option>
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Catering Manager">Catering Manager</option>
                    <option value="Stylist">Stylist</option>
                    <option value="Other">Other Professionals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={vendorFormData.name}
                    onChange={(e) => setVendorFormData({...vendorFormData, name: e.target.value})}
                    placeholder="Contact Name"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Phone Number</label>
                  <input 
                    required
                    type="text" 
                    value={vendorFormData.phoneNumber}
                    onChange={(e) => setVendorFormData({...vendorFormData, phoneNumber: e.target.value})}
                    placeholder="e.g. +919876543210"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Notes / Details</label>
                  <textarea 
                    value={vendorFormData.note}
                    onChange={(e) => setVendorFormData({...vendorFormData, note: e.target.value})}
                    placeholder="Additional information..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
                  />
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-light text-white font-bold py-4 rounded-full shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                  >
                    {selectedInvitee ? "Update Contact" : "Add Contact"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="w-full text-charcoal/40 font-bold py-2 text-[10px] uppercase tracking-[0.2em] hover:text-charcoal transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Expense Form Content */}
            {activeTab === "expenditures" && (
              <form onSubmit={handleExpenseSave} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                  <input 
                    required
                    type="text" 
                    value={expenseFormData.description}
                    onChange={(e) => setExpenseFormData({...expenseFormData, description: e.target.value})}
                    placeholder="e.g. Venue Advance Payment"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Paid To / Recipient</label>
                  <input 
                    type="text" 
                    value={expenseFormData.paidTo}
                    onChange={(e) => setExpenseFormData({...expenseFormData, paidTo: e.target.value})}
                    placeholder="e.g. Vendor Name or Person Name"
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Payment Method</label>
                    <select 
                      value={expenseFormData.paymentMethod}
                      onChange={(e) => setExpenseFormData({...expenseFormData, paymentMethod: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Receipt / Ref (Doc)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-charcoal/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                      />
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" /> Selected: {selectedFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Paid By</label>
                    <select 
                      value={expenseFormData.paidBy}
                      onChange={(e) => setExpenseFormData({...expenseFormData, paidBy: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      {Object.keys(payerBudgets).map(payer => (
                        <option key={payer} value={payer}>{payer}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Amount (Rs.)</label>
                    <input 
                      required
                      type="number" 
                      value={expenseFormData.amount}
                      onChange={(e) => setExpenseFormData({...expenseFormData, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Date</label>
                    <input 
                      required
                      type="date" 
                      value={expenseFormData.date}
                      onChange={(e) => setExpenseFormData({...expenseFormData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Category</label>
                  <select 
                    required
                    value={expenseFormData.category}
                    onChange={(e) => setExpenseFormData({...expenseFormData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categoryBudgets).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-light text-white font-bold py-4 rounded-full shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : (selectedInvitee ? "Update Record" : "Log Expense")}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="w-full text-charcoal/40 font-bold py-2 text-[10px] uppercase tracking-[0.2em] hover:text-charcoal transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Budget Modal */}
      <AnimatePresence>
        {isEditingBudgets && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingBudgets(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-8 sm:p-10 pb-6 border-b border-charcoal/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-serif text-charcoal mb-1">Manage Budget Plan</h2>
                    <p className="text-charcoal/40 text-sm">Define and update your planned spending categories.</p>
                  </div>
                  <button onClick={() => setIsEditingBudgets(false)} className="p-2 hover:bg-charcoal/5 rounded-full text-charcoal/40 transition-colors">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 sm:p-10 py-6 custom-scrollbar">
                <h3 className="text-xl font-serif text-charcoal mb-4">Manage Categories</h3>
                <div className="space-y-4 mb-8">
                {Object.entries(categoryBudgets).map(([category, budget]) => (
                  <div key={category} className="flex items-center gap-4 p-4 bg-[#faf9f6] rounded-2xl border border-charcoal/5 group">
                    <div className="flex-1">
                      <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mb-1">Category Name</p>
                      <input 
                        type="text" 
                        value={category}
                        readOnly
                        className="bg-transparent font-bold text-charcoal outline-none w-full"
                      />
                    </div>
                    <div className="w-48">
                      <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mb-1">Budget (Rs.)</p>
                      <input 
                        type="number" 
                        value={budget}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setCategoryBudgets(prev => ({...prev, [category]: val}));
                        }}
                        className="bg-white px-3 py-2 rounded-xl border border-charcoal/10 text-sm font-bold text-charcoal w-full focus:ring-2 focus:ring-gold/20 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newBudgets = {...categoryBudgets};
                        delete newBudgets[category];
                        setCategoryBudgets(newBudgets);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gold/5 p-6 rounded-3xl border border-gold/10">
                <p className="text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-4">Add New Category</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                  <input 
                    type="number" 
                    placeholder="Amount"
                    value={newCategoryBudget || ""}
                    onChange={(e) => setNewCategoryBudget(parseFloat(e.target.value) || 0)}
                    className="w-full sm:w-32 px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                  <button 
                    onClick={() => {
                      if (newCategoryName && !categoryBudgets[newCategoryName]) {
                        setCategoryBudgets(prev => ({...prev, [newCategoryName]: newCategoryBudget}));
                        setNewCategoryName("");
                        setNewCategoryBudget(0);
                      }
                    }}
                    className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-xl shadow-md transition-all font-bold text-sm whitespace-nowrap"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              <div className="border-t border-charcoal/5 pt-8 mb-8">
                <h3 className="text-xl font-serif text-charcoal mb-4">Manage Payer Contributions</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                  {Object.entries(payerBudgets).map(([payer, budget]) => (
                    <div key={payer} className="flex items-center gap-4 p-4 bg-[#faf9f6] rounded-2xl border border-charcoal/5 group">
                      <div className="flex-1">
                        <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mb-1">Payer Name</p>
                        <input 
                          type="text" 
                          value={payer}
                          readOnly
                          className="bg-transparent font-bold text-charcoal outline-none w-full"
                        />
                      </div>
                      <div className="w-48">
                        <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mb-1">Budget (Rs.)</p>
                        <input 
                          type="number" 
                          value={budget}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPayerBudgets(prev => ({...prev, [payer]: val}));
                          }}
                          className="bg-white px-3 py-2 rounded-xl border border-charcoal/10 text-sm font-bold text-charcoal w-full focus:ring-2 focus:ring-gold/20 outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newBudgets = {...payerBudgets};
                          delete newBudgets[payer];
                          setPayerBudgets(newBudgets);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gold/5 p-6 rounded-3xl border border-gold/10">
                  <p className="text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-4">Add New Payer</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      placeholder="Payer Name"
                      value={newPayerName}
                      onChange={(e) => setNewPayerName(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                    <input 
                      type="number" 
                      placeholder="Amount"
                      value={newPayerBudget || ""}
                      onChange={(e) => setNewPayerBudget(parseFloat(e.target.value) || 0)}
                      className="w-full sm:w-32 px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                    <button 
                      onClick={() => {
                        if (newPayerName && !payerBudgets[newPayerName]) {
                          setPayerBudgets(prev => ({...prev, [newPayerName]: newPayerBudget}));
                          setNewPayerName("");
                          setNewPayerBudget(0);
                        }
                      }}
                      className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-xl shadow-md transition-all font-bold text-sm whitespace-nowrap"
                    >
                      Add Payer
                    </button>
                  </div>
                </div>
              </div>
              </div>

              <div className="p-8 sm:p-10 pt-6 border-t border-charcoal/5 flex justify-between items-center bg-white">
                 <div>
                    <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">Total Planned Budget</p>
                    <p className="text-2xl font-serif text-gold">Rs.{totalBudget.toLocaleString()}</p>
                 </div>
                 <button 
                  onClick={() => setIsEditingBudgets(false)}
                  className="bg-charcoal text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-charcoal/90 transition-all shadow-lg"
                 >
                  Save & Close
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── THANKS CARD IMAGE MANAGER ── */}
      {activeTab === "thanks" && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Upload Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-charcoal/5 shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <ImageUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal">Upload New Image</h3>
                  <p className="text-[11px] text-charcoal/40 font-bold uppercase tracking-widest">
                    Replaces the current thanks card photo
                  </p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) handleThanksFileSelect(file);
                }}
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center text-center p-8 cursor-pointer mb-6 ${
                  isDragging
                    ? "border-gold bg-gold/5 scale-[1.01]"
                    : "border-charcoal/10 hover:border-gold/40 hover:bg-gold/3"
                }`}
                onClick={() => document.getElementById("thanks-file-input")?.click()}
              >
                <input
                  id="thanks-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleThanksFileSelect(file);
                    e.target.value = "";
                  }}
                />

                {thanksPreview ? (
                  <img
                    src={thanksPreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-xl mb-4"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                      <ImageUp className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-charcoal/60 mb-1">
                      Drag &amp; drop an image here
                    </p>
                    <p className="text-xs text-charcoal/30">or click to browse — JPG, PNG, WEBP, AVIF</p>
                  </>
                )}
              </div>

              {thanksPreview && (
                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest text-center mb-4">
                  {thanksFile?.name}
                </p>
              )}

              {/* Status Messages */}
              {thanksStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3 mb-4 text-sm font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Image uploaded successfully! The Thanks Card has been updated.
                </div>
              )}
              {thanksStatus === "error" && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-4 py-3 mb-4 text-sm font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Upload failed. Please try again.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {thanksFile && (
                  <button
                    onClick={() => { setThanksFile(null); setThanksPreview(null); setThanksStatus("idle"); }}
                    className="flex-1 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal/60 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Clear
                  </button>
                )}
                <button
                  disabled={!thanksFile || thanksUploading}
                  onClick={handleThanksUpload}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    thanksFile && !thanksUploading
                      ? "bg-gold hover:bg-gold-light text-white shadow-md shadow-gold/20"
                      : "bg-charcoal/5 text-charcoal/25 cursor-not-allowed"
                  }`}
                >
                  {thanksUploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  ) : (
                    <><ImageUp className="w-4 h-4" /> Upload &amp; Replace</>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Current Image Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[32px] border border-charcoal/5 shadow-sm p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <ImageUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-charcoal">Current Image</h3>
                    <p className="text-[11px] text-charcoal/40 font-bold uppercase tracking-widest">
                      Live on thanks card right now
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchCurrentThanksImage}
                  className="text-xs font-bold text-charcoal/40 hover:text-gold border border-charcoal/10 hover:border-gold/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  Refresh
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center rounded-2xl bg-[#f7f4ef] overflow-hidden min-h-[280px]">
                {currentThanksImage ? (
                  <img
                    src={currentThanksImage}
                    alt="Current Thanks Card"
                    className="w-full h-full object-contain max-h-[400px]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-charcoal/30 p-8 text-center">
                    <ImageUp className="w-10 h-10" />
                    <p className="text-sm font-bold">No image uploaded yet</p>
                    <p className="text-xs">Upload an image using the panel on the left</p>
                  </div>
                )}
              </div>

              {currentThanksImage && (
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Image is active and showing on the Thanks Card page
                </div>
              )}
            </motion.div>

          </div>

          {/* QR Code Generator Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 bg-white rounded-[32px] border border-charcoal/5 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 lg:col-span-2"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal">Thank You QR Code</h3>
                  <p className="text-[11px] text-charcoal/40 font-bold uppercase tracking-widest">
                    Generate scannable QR for physical print
                  </p>
                </div>
              </div>
              <p className="text-charcoal/60 text-sm mb-6 max-w-sm">
                Have guests scan this code to view the digital thank you message. You can customize the colors to match your wedding theme before downloading.
              </p>

              <div className="flex gap-8 mb-8">
                <div className="flex flex-col items-start">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">QR Color</label>
                  <input 
                    type="color" 
                    value={qrColor} 
                    onChange={e => setQrColor(e.target.value)} 
                    className="w-10 h-10 rounded-full cursor-pointer border-none p-0 overflow-hidden" 
                  />
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">Text Color</label>
                  <input 
                    type="color" 
                    value={qrTextColor} 
                    onChange={e => setQrTextColor(e.target.value)} 
                    className="w-10 h-10 rounded-full cursor-pointer border-none p-0 overflow-hidden" 
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  const canvas = document.createElement("canvas");
                  const svg = document.getElementById("thank-you-qr");
                  if (!svg) return;
                  const serializer = new XMLSerializer();
                  const source = serializer.serializeToString(svg);
                  const img = new window.Image();
                  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.fillStyle = "white";
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, 0, 0);
                      const a = document.createElement("a");
                      a.download = "ThankYouQR.png";
                      a.href = canvas.toDataURL("image/png");
                      a.click();
                    }
                  };
                }}
                className="bg-charcoal text-white hover:bg-charcoal/90 px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all w-full sm:w-auto"
              >
                <Download className="w-5 h-5" /> Download Printable QR
              </button>
            </div>

            <div className="bg-[#f7f4ef] p-6 rounded-[24px] border border-charcoal/5 flex justify-center items-center shrink-0">
              <QRCodeSVG 
                id="thank-you-qr"
                value= {`${API_BASE_URL}/thanks`} 
                size={1000}
                level="H"
                includeMargin={true}
                fgColor={qrColor}
                bgColor="#ffffff"
                style={{ width: "200px", height: "200px" }}
                imageSettings={{
                  src: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="150" viewBox="0 0 500 150"><rect width="500" height="150" fill="#ffffff" rx="30"/><text x="250" y="100" font-family="sans-serif" font-size="50" font-weight="bold" fill="${qrTextColor}" text-anchor="middle">Oshani &amp; Subhash</text></svg>`)}`,
                  x: undefined,
                  y: undefined,
                  height: 150,
                  width: 500,
                  excavate: true,
                }}
              />
            </div>
          </motion.div>


          {/* Storage path info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-charcoal/3 border border-charcoal/5 rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center text-charcoal/30 shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 mb-0.5">Storage Path</p>
              <p className="text-xs font-mono text-charcoal/50">E:\My_Projects\Archive\invitation\thanks</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
