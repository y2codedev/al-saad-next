'use client';

import { useEffect } from 'react';

export default function TabbyTamaraWidget({ finalAmount, currencyCode, locale }) {
    useEffect(() => {
        // Load Tabby script
        const tabbyScript = document.createElement('script');
        tabbyScript.src = 'https://checkout.tabby.ai/tabby-promo.js';
        tabbyScript.async = true;
        document.body.appendChild(tabbyScript);

        // Load Tamara script
        const tamaraScript = document.createElement('script');
        tamaraScript.src = 'https://cdn.tamara.co/widget/product-widget.min.js';
        tamaraScript.async = true;
        document.body.appendChild(tamaraScript);

        // Wait and initialize both
        const timeout = setTimeout(() => {
            if (window.TabbyPromo) {
                new window.TabbyPromo({
                    installmentsCount: 4,
                    selector: '#tabby-promo',
                    lang: locale,
                    currency: currencyCode,
                    price: finalAmount,
                });
            }

            if (window.TamaraProductWidget) {
                const tamaraEl = document.querySelector('.tamara-product-widget');
                if (tamaraEl) {
                    tamaraEl.setAttribute('data-price', finalAmount);
                }
                window.TamaraProductWidget.init({ lang: locale });
                window.TamaraProductWidget.render();
            }

            // Set Tabby iframe src
            const iframe = document.getElementById('tabby-iFrameName');
            if (iframe) {
                iframe.setAttribute(
                    'src',
                    `https://widgets.tabby.ai/webviews/product-page/installments/${locale}/?merchant=styli&currency=${currencyCode}&price=${finalAmount}`
                );
            }
        }, 500);

        return () => { clearTimeout(timeout); document.body.removeChild(tabbyScript); document.body.removeChild(tamaraScript); }
    }, [finalAmount, currencyCode, locale]);

    return (
        <>
            <div id="tabby-promo" style={{ marginTop: '15px' }} />
            <div
                style={{ margin: '10px 0px' }}
                className="tamara-product-widget"
                data-price={finalAmount}
                data-currency={currencyCode}
                data-lang={locale}
            />
        </>
    );
}
