import React from "react";

const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        outline: "border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };

    const selectedVariant = variants[variant] || variants.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedVariant} ${className}`}>
            {children}
        </span>
    );
};

export { Badge };
export default Badge;
