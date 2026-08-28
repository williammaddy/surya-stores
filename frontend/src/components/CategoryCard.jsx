import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index = 0 }) => {
  if (!category) return null;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-[#38bdf8] p-4 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
    >
      <div>
        {/* Category Image Frame */}
        <div className="relative aspect-16/10 rounded-lg bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] overflow-hidden mb-3.5 border border-[#bae6fd]">
          <img
            src={
              category.image ||
              'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80'
            }
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-display group-hover:text-[#dc2626] transition-colors">
          {category.name}
        </h3>

        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
          {category.description || 'Quality school books and stationery in this category.'}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
        <span className="text-slate-400 text-[11px] font-semibold">
          {category.productCount !== undefined ? `${category.productCount} Products` : 'Available'}
        </span>
        <span className="text-[#0284c7] group-hover:text-[#dc2626] flex items-center gap-1 group-hover:translate-x-1 transition-all">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
