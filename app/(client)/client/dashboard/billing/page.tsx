"use client";

import React from "react";
import { CreditCard, FileText, Download, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-slate-500">
          Manage your subscription, payment methods, and invoices
        </p>
      </div>

      {/* Current Plan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Current Plan</h2>

          <div className="mt-4 flex items-center justify-between rounded-xl border bg-slate-50 p-4">
            <div>
              <p className="text-xl font-bold">Pro Plan</p>
              <p className="text-sm text-slate-500">$49 / month</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 size={16} />
                Active subscription
              </div>
            </div>

            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Change Plan
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Payment Method</h2>

          <div className="mt-4 rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" />
              <div>
                <p className="font-semibold">Visa ending in 4242</p>
                <p className="text-sm text-slate-500">Expires 12/26</p>
              </div>
            </div>

            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold hover:bg-slate-100">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Invoices</h2>

        <div className="mt-4 overflow-hidden rounded-xl border">
          <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            <div className="col-span-4">Invoice</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Rows */}
          {[
            { id: "INV-001", date: "Jan 10, 2026", amount: "$49", status: "Paid" },
            { id: "INV-002", date: "Dec 10, 2025", amount: "$49", status: "Paid" },
            { id: "INV-003", date: "Nov 10, 2025", amount: "$49", status: "Paid" },
          ].map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-12 items-center px-4 py-4 border-t"
            >
              <div className="col-span-4 font-semibold">{inv.id}</div>
              <div className="col-span-3 text-sm text-slate-500">{inv.date}</div>
              <div className="col-span-2 font-semibold">{inv.amount}</div>
              <div className="col-span-2">
                <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  {inv.status}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100">
                  <Download size={14} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Info */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Billing Information</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold">Company Name</p>
            <p className="text-sm text-slate-500">ShafaCode Ltd.</p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold">Billing Email</p>
            <p className="text-sm text-slate-500">billing@shafacode.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
