import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4 shadow-xs">
    <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
    </div>
    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full animate-pulse divide-y divide-slate-100">
    <div className="py-3.5 bg-slate-50 flex gap-4 px-6">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded flex-1"></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="py-4 flex gap-4 px-6 items-center">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="h-4 bg-slate-100 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 animate-pulse">
    <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0"></div>
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      <div className="h-6 bg-slate-200 rounded w-1/2"></div>
      <div className="h-2 bg-slate-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="bg-white rounded-3xl border border-slate-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="aspect-square bg-slate-200 rounded-2xl"></div>
      <div className="space-y-4 py-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-24 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default {
  ProductCardSkeleton,
  TableSkeleton,
  DashboardStatSkeleton,
  ProductDetailSkeleton,
};
