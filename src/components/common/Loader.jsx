import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading...', overlay = false }) => {
    const loaderContent = (
        <div className="flex flex-col items-center justify-center">
            {/* Premium centered loader */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                {/* Background Ring (Track) */}
                <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />

                {/* Spinning Ring */}
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />

                {/* Pulsing Core */}
                <div className="relative w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(241,90,36,0.5)]" />
                </div>
            </div>

            {message && (
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
                        {message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-medium">
                        Please wait
                    </p>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex items-center justify-center">
                {loaderContent}
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-inherit">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center py-16">
            {loaderContent}
        </div>
    );
};

export default Loader;
