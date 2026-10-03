import { useEffect, useState } from 'react';
import { getAdminNewsletterSubscribers } from '../services/newsletterSubscriberService';
import type { PaginatedNewsletterSubscribers, NewsletterSubscriber } from '../types/newsletterSubscriber.types';
import { ChevronLeft, ChevronRight, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getApiErrorMessage } from '../utils/apiError';

export function AdminNewsletterSubscribersPage() {
  const [data, setData] = useState<PaginatedNewsletterSubscribers | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSubscribers(currentPage);
  }, [currentPage]);

  async function loadSubscribers(page: number) {
    setIsLoading(true);
    try {
      const response = await getAdminNewsletterSubscribers(page);
      setData(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load newsletter subscribers.'));
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
          <p className="text-slate-600">Loading newsletter subscribers...</p>
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
            onClick={() => loadSubscribers(currentPage)}
            className="px-4 py-2 bg-ak-blue text-white rounded-lg hover:bg-ak-blue-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const subscribers = data?.data ?? [];
  const meta = data?.meta;
  const links = data?.links;

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ak-navy-900">Newsletter Subscribers</h1>
        <p className="text-slate-500">Manage newsletter subscriptions</p>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-12 text-center">
          <Mail size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-display font-bold text-xl text-ak-navy-900 mb-2">No subscribers yet</h3>
          <p className="text-slate-500">Newsletter subscribers will appear here.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-6 text-sm text-slate-600">
            Showing {meta?.from ?? 0} to {meta?.to ?? 0} of {meta?.total ?? 0} subscribers
          </div>

          {/* Table */}
          <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f7f7f5] border-b border-black/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subscribed At</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {subscribers.map((subscriber: NewsletterSubscriber) => (
                    <tr key={subscriber.id} className="hover:bg-[#f7f7f5] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-ak-navy-900">
                          <Mail size={16} />
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={16} />
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle size={12} />
                            Inactive
                          </span>
                        )}
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
