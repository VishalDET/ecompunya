import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <img alt="Punya Logo" className="h-8 w-auto mix-blend-multiply" src="/assets/img/logo/punya_logo.png" />
                    <p className="text-sm text-slate-500 leading-relaxed">Punya is dedicated to preserving the rich heritage of Indian weaves while modernizing silhouettes for the contemporary woman.</p>
                    <div className="flex space-x-4">
                        <a className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-primary transition-colors" href="#">
                            {/* SVG Placeholders since font-awesome isn't in index file */}
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                        </a>
                        <a className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-primary transition-colors" href="#">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                        </a>
                        <a className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-primary transition-colors" href="#">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0a12 12 0 00-4.37 23.18c-.08-.83-.15-2.09.03-2.99.17-.82 1.1-4.66 1.1-4.66s-.28-.56-.28-1.39c0-1.3.75-2.27 1.7-2.27.8 0 1.18.6 1.18 1.32 0 .8-.5 2-.77 3.12-.22.94.47 1.71 1.4 1.71 1.68 0 2.97-1.77 2.97-4.32 0-2.26-1.62-3.84-3.95-3.84-2.7 0-4.29 2.03-4.29 4.12 0 .82.32 1.7.71 2.18.08.1.09.18.06.29-.08.35-.27 1.1-.3 1.25-.05.18-.16.22-.35.13-1.3-.6-2.11-2.48-2.11-4 0-3.26 2.37-6.26 6.84-6.26 3.59 0 6.38 2.56 6.38 5.98 0 3.57-2.25 6.44-5.38 6.44-1.05 0-2.04-.55-2.38-1.2l-.65 2.47c-.23.9-.86 2.02-1.28 2.7A12.01 12.01 0 1012 0z" /></svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-slate-900">Shopping Guide</h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li><Link className="hover:text-primary transition-colors" to="/faq">Draping Guides</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/faq">Saree Care Tips</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/faq">Fabric Guide</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/shipping">Shipping & Returns</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-slate-900">Company</h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li><Link className="hover:text-primary transition-colors" to="/about">Our Story</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/about">Artisans & Craft</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/about">Sustainability</Link></li>
                        <li><Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-slate-900">Newsletter</h4>
                    <p className="text-sm text-slate-500 mb-4">Be the first to know about new collection launches.</p>
                    <form className="flex" onSubmit={(e) => e.preventDefault()}>
                        <input className="w-full text-sm bg-white border border-slate-200 rounded-l-lg focus:ring-primary focus:border-primary px-4 py-2 outline-none" placeholder="Your email" type="email" />
                        <button className="bg-primary text-white px-4 rounded-r-lg hover:bg-orange-600 transition-colors flex items-center justify-center" type="submit">
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-400">
                <p>© {new Date().getFullYear()} Punya Ethnic Wear. All rights reserved.</p>
                <div className="flex space-x-6">
                    <Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
                    <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
                    <Link className="hover:text-primary transition-colors" to="/faq">Accessibility</Link>
                </div>
            </div>

            {/* Mobile Filter floating button - keeping it as it was in design, though functionality might need context later */}
            <div className="fixed bottom-6 right-6 md:hidden z-40">
                <button className="bg-primary text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center">
                    <span className="material-icons-outlined">filter_list</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
