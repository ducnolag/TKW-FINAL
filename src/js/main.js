import '/utils/include.js';

import './layouts/floating-navigation.js'
import './layouts/header.js';
import './layouts/footer.js';
import './layouts/chatbot.js';
import '/page/home/js/slide.js';
import '/page/home/js/bestseller.js';
import '/page/home/js/feature.js';



fetch('/data/product.json')
    .then(res => res.json())
    .then(data => localStorage.setItem('products_data', JSON.stringify(data)));