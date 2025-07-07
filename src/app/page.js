"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  LogOut,
} from "lucide-react";

const APDTCLSystem = () => {
  // Application state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("landing");
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([
    {
      id: "vendor1",
      username: "vendor1",
      password: "password",
      role: "vendor",
      name: "John Contractor",
    },
    {
      id: "da1",
      username: "dealing_assistant",
      password: "password",
      role: "dealing_assistant",
      name: "DA Officer",
    },
    {
      id: "aee1",
      username: "aee",
      password: "password",
      role: "aee",
      name: "AEE Officer",
    },
    {
      id: "ce1",
      username: "ce",
      password: "password",
      role: "ce",
      name: "CE Officer",
    },
    {
      id: "md1",
      username: "md",
      password: "password",
      role: "md",
      name: "MD Officer",
    },
  ]);

  // Form states
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    phone: "",
  });
  const [applicationForm, setApplicationForm] = useState({
    contractorName: "",
    address: "",
    phone: "",
    email: "",
    additionalField1: "",
    additionalField2: "",
    documents: {
      pan: null,
      gst: null,
      laborLicense: null,
      photograph: null,
    },
  });

  // Generate sample applications for demo
  useEffect(() => {
    const sampleApps = [
      {
        id: "APP001",
        vendorId: "vendor1",
        contractorName: "ABC Construction",
        address: "Guwahati, Assam",
        phone: "6002256662",
        email: "contractor1@gmail.com",
        additionalField1: "Field Value 1",
        additionalField2: "Field Value 2",
        documents: {
          pan: "pan.pdf",
          gst: "gst.pdf",
          laborLicense: "labourlicense.pdf",
          photograph: "photograph.png",
        },
        status: "pending_da",
        submittedAt: new Date("2025-01-15"),
        remarks: [],
        type: "new",
      },
      {
        id: "APP002",
        vendorId: "vendor1",
        contractorName: "XYZ Builders",
        address: "Dispur, Assam",
        phone: "6002256663",
        email: "contractor2@gmail.com",
        additionalField1: "Test Field 1",
        additionalField2: "Test Field 2",
        documents: {
          pan: "pan2.pdf",
          gst: "gst2.pdf",
          laborLicense: "labourlicense2.pdf",
          photograph: "photograph2.png",
        },
        status: "pending_md",
        submittedAt: new Date("2025-01-10"),
        remarks: [],
        type: "new",
      },
    ];
    setApplications(sampleApps);
  }, []);

  // Authentication functions
  const handleLogin = () => {
    const user = users.find(
      (u) =>
        u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setCurrentPage(`${user.role}_dashboard`);
      setLoginForm({ username: "", password: "" });
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegister = () => {
    if (registerForm.username && registerForm.password && registerForm.phone) {
      const newUser = {
        id: `vendor_${Date.now()}`,
        username: registerForm.username,
        password: registerForm.password,
        role: "vendor",
        name: registerForm.username,
        phone: registerForm.phone,
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setCurrentPage("vendor_dashboard");
      setRegisterForm({ username: "", password: "", phone: "" });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  // Application submission
  const handleApplicationSubmit = () => {
    const newApplication = {
      id: `APP${String(applications.length + 1).padStart(3, "0")}`,
      vendorId: currentUser.id,
      ...applicationForm,
      status: "pending_da",
      submittedAt: new Date(),
      remarks: [],
      type: "new",
    };
    setApplications([...applications, newApplication]);
    setApplicationForm({
      contractorName: "",
      address: "",
      phone: "",
      email: "",
      additionalField1: "",
      additionalField2: "",
      documents: { pan: null, gst: null, laborLicense: null, photograph: null },
    });
    alert("Application submitted successfully!");
  };

  // Approval workflow functions
  const handleApproval = (appId, action, remarks = "") => {
    setApplications((apps) =>
      apps.map((app) => {
        if (app.id === appId) {
          let newStatus = app.status;
          const newRemarks = [...app.remarks];

          if (action === "approve") {
            switch (app.status) {
              case "pending_da":
                newStatus = "pending_aee";
                break;
              case "pending_aee":
                newStatus = "pending_ce";
                break;
              case "pending_ce":
                newStatus = "pending_md";
                break;
              case "pending_md":
                newStatus = "approved";
                break;
            }
          } else if (action === "reject") {
            newStatus = "rejected";
            newRemarks.push({
              by: currentUser.role,
              remark: remarks,
              date: new Date(),
            });
          }

          return { ...app, status: newStatus, remarks: newRemarks };
        }
        return app;
      })
    );
  };

  const generateRC = (appId) => {
    setApplications((apps) =>
      apps.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: "rc_generated",
            rcNumber: `RC${Date.now()}`,
            generatedAt: new Date(),
          };
        }
        return app;
      })
    );
    alert("RC generated successfully with digital signature!");
  };

  // File upload simulation
  const handleFileUpload = (field) => {
    const fileName = prompt(`Enter filename for ${field}:`);
    if (fileName) {
      setApplicationForm((prev) => ({
        ...prev,
        documents: { ...prev.documents, [field]: fileName },
      }));
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending_da: {
        label: "Pending DA Review",
        color: "bg-yellow-100 text-yellow-800",
      },
      pending_aee: {
        label: "Pending AEE Review",
        color: "bg-blue-100 text-blue-800",
      },
      pending_ce: {
        label: "Pending CE Review",
        color: "bg-purple-100 text-purple-800",
      },
      pending_md: {
        label: "Pending MD Approval (CE Review)",
        color: "bg-orange-100 text-orange-800",
      },
      approved: { label: "Approved", color: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
      rc_generated: {
        label: "RC Generated",
        color: "bg-emerald-100 text-emerald-800",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Landing Page
  if (currentPage === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">APDTCL</h1>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                Policy
              </a>
              <button
                onClick={() => setCurrentPage("signin")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Vendor Registration
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Streamlined digital platform for contractors and vendors to
              register, manage credentials, and access government procurement
              opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">New Vendors</h3>
              <p className="text-gray-800 mb-6">
                Register as a new vendor to start the RC application process.
              </p>
              <button
                onClick={() => setCurrentPage("register")}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Register Now
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Existing Users</h3>
              <p className="text-gray-800 mb-6">
                Sign in to access your dashboard and manage applications.
              </p>
              <button
                onClick={() => setCurrentPage("signin")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Registration Page
  if (currentPage === "register") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Register as Vendor</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Register
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-gray-800">
            Already have an account?{" "}
            <button
              onClick={() => setCurrentPage("signin")}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Sign In Page
  if (currentPage === "signin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Sign in to APDTCL</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800">Or</p>
            <button
              onClick={() => setCurrentPage("register")}
              className="mt-2 text-blue-600 hover:underline"
            >
              Register as Vendor
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-800 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="text-xs space-y-1 text-gray-800">
              <p>
                <strong>Vendor:</strong> vendor1 / password
              </p>
              <p>
                <strong>DA:</strong> dealing_assistant / password
              </p>
              <p>
                <strong>AEE:</strong> aee / password
              </p>
              <p>
                <strong>CE:</strong> ce / password
              </p>
              <p>
                <strong>MD:</strong> md / password
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vendor Dashboard
  if (currentPage === "vendor_dashboard") {
    const userApplications = applications.filter(
      (app) => app.vendorId === currentUser.id
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              APDTCL - Welcome {currentUser.name}!
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Register New RC
              </h3>
              <p className="text-gray-800 mb-4">
                Apply for a new registration certificate
              </p>
              <button
                onClick={() => setCurrentPage("new_registration")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Register New RC
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Renew RC
              </h3>
              <p className="text-gray-800 mb-4">
                Renew your existing registration certificate
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Renew RC
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Clock className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Track Status
              </h3>
              <p className="text-gray-800 mb-4">
                Monitor your application progress
              </p>
              <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                Track Applications
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Applications
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {userApplications.length === 0 ? (
                <div className="p-6 text-center text-gray-800">
                  {`No applications found. Click "Register New RC" to start.`}
                </div>
              ) : (
                userApplications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {app.contractorName}
                        </h4>
                        <p className="text-sm text-gray-900">
                          Application ID: {app.id}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>Address:</strong> {app.address}
                      </p>
                      <p>
                        <strong>Phone:</strong> {app.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {app.email}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {app.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                    {app.status === "rc_generated" && (
                      <div className="mt-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download RC</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // New Registration Form
  if (currentPage === "new_registration") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              New RC Registration
            </h1>
            <button
              onClick={() => setCurrentPage("vendor_dashboard")}
              className="text-gray-600 hover:text-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of Contractor
                  </label>
                  <input
                    type="text"
                    value={applicationForm.contractorName}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        contractorName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={applicationForm.address}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        address: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Field 1
                  </label>
                  <input
                    type="text"
                    value={applicationForm.additionalField1}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        additionalField1: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Field 2
                  </label>
                  <input
                    type="text"
                    value={applicationForm.additionalField2}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        additionalField2: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: "pan", label: "Upload PAN" },
                    { key: "gst", label: "Upload GST" },
                    { key: "laborLicense", label: "Upload Labour License" },
                    { key: "photograph", label: "Upload Photograph" },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="border border-gray-300 rounded-lg p-4"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {doc.label}
                      </label>
                      <button
                        onClick={() => handleFileUpload(doc.key)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50"
                      >
                        <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-800">
                          {applicationForm.documents[doc.key]
                            ? applicationForm.documents[doc.key]
                            : "Click to upload"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleApplicationSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Submit Application
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Staff Dashboards (DA, AEE, CE, MD)
  if (currentPage.includes("_dashboard")) {
    const role = currentPage.replace("_dashboard", "");
    const roleNames = {
      dealing_assistant: "Dealing Assistant",
      aee: "Assistant Executive Engineer",
      ce: "Chief Engineer",
      md: "Managing Director",
    };

    // Filter applications based on role permissions
    let filteredApplications = [];
    if (role === "dealing_assistant") {
      filteredApplications = applications.filter(
        (app) => app.status === "pending_da"
      );
    } else if (role === "aee") {
      filteredApplications = applications.filter(
        (app) => app.status === "pending_aee"
      );
    } else if (role === "ce") {
      filteredApplications = applications.filter((app) =>
        ["pending_md", "approved", "rc_generated"].includes(app.status)
      );
    } else if (role === "md") {
      filteredApplications = applications.filter(
        (app) => app.status === "pending_md"
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              APDTCL - Welcome {roleNames[role] || currentUser.name}!
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <User className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Profile
              </h3>
              <p className="text-gray-800">Manage your profile</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                New Registrations
              </h3>
              <p className="text-gray-800">
                {
                  filteredApplications.filter((app) => app.type === "new")
                    .length
                }{" "}
                pending
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Renewals
              </h3>
              <p className="text-gray-800">
                {
                  filteredApplications.filter((app) => app.type === "renewal")
                    .length
                }{" "}
                pending
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Clock className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Track Status
              </h3>
              <p className="text-gray-800">Monitor applications</p>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {role === "ce" ? "All Applications" : "Pending Applications"}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <div className="p-6 text-center text-gray-800">
                  No applications pending review.
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{app.contractorName}</h4>
                        <p className="text-sm text-gray-900">
                          Application ID: {app.id}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-900 mb-4">
                      <p>
                        <strong>Address:</strong> {app.address}
                      </p>
                      <p>
                        <strong>Phone:</strong> {app.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {app.email}
                      </p>
                      <p>
                        <strong>Additional Field 1:</strong>{" "}
                        {app.additionalField1}
                      </p>
                      <p>
                        <strong>Additional Field 2:</strong>{" "}
                        {app.additionalField2}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {app.submittedAt.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium mb-2 text-gray-900">
                        Documents:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(app.documents).map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-900"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons based on role */}
                    {role !== "ce" && (
                      <div className="flex space-x-2">
                        {role === "md" ? (
                          <button
                            onClick={() => generateRC(app.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Generate RC with Digital Signature</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApproval(app.id, "approve")}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>
                                {role === "dealing"
                                  ? "Verify and Forward to AEE"
                                  : role === "aee"
                                  ? "Verify and Forward to CE and MD"
                                  : "Approve"}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                const remarks = prompt(
                                  "Enter remarks for rejection:"
                                );
                                if (remarks)
                                  handleApproval(app.id, "reject", remarks);
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject with Remarks</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {role === "ce" && (
                      <div className="flex items-center space-x-1 text-gray-800">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View Only</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default function Home() {
  return <APDTCLSystem />;
}
