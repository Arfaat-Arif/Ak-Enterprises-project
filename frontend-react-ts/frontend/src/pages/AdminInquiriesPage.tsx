import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminInquiries } from '../services/inquiryService';
import type { PaginatedInquiries, Inquiry } from '../types/inquiry.types';
import { ChevronLeft, ChevronRight, Package, MessageSquare, Mail, Phone, Building2 } from 'lucide-react';
import { getApiErrorMessage } from '../utils/apiError';

const statusColors = {
  new: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800',
} as const;

export function AdminInquiriesPage() {
  const [data, setData] = useState<PaginatedInquiries | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadInquiries(currentPage);
  }, [currentPage]);

  async function loadInquiries(page: number) {
    setIsLoading(true);
    try {
      const response = await getAdminInquiries(page);
      setData(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load inquiries.'));
    } finally {
      setIsLoading(false);
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= (data?.meta.last_page || 1)) {
      setCurrentPage(page);
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-ak-blue border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadInquiries(currentPage)}
            className="px-4 py-2 bg-ak-blue text-white rounded-lg hover:bg-ak-blue-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inquiries = data?.data ?? [];
  const meta = data?.meta;
  const links = data?.links;

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ak-navy-900">Inquiries</h1>
        <p className="text-slate-500">Manage contact form submissions</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-display font-bold text-xl text-ak-navy-900 mb-2">No inquiries yet</h3>
          <p className="text-slate-500">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-6 text-sm text-slate-600">
            Showing {meta?.from ?? 0} to {meta?.to ?? 0} of {meta?.total ?? 0} inquiries
          </div>

          {/* Table */}
          <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f7f7f5] border-b border-black/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {inquiries.map((inquiry: Inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-[#f7f7f5] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-ak-navy-900">{inquiry.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} />
                          {inquiry.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inquiry.phone ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} />
                            {inquiry.phone}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inquiry.company ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building2 size={14} />
                            {inquiry.company}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inquiry.product ? (
                          <Link
                            to={`/products/${inquiry.product.slug}`}
                            className="flex items-center gap-2 text-sm text-ak-blue hover:underline"
                          >
                            <Package size={14} />
                            {inquiry.product.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[inquiry.status as keyof typeof statusColors]}`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-slate-600 truncate" title={inquiry.message}>
                          {inquiry.message}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {meta.current_page} of {meta.last_page}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(meta.current_page - 1)}
                  disabled={!links?.prev}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-black/10 rounded-lg bg-white hover:bg-[#f7f7f5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => goToPage(meta.current_page + 1)}
                  disabled={!links?.next}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-black/10 rounded-lg bg-white hover:bg-[#f7f7f5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
