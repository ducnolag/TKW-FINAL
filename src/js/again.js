import '/utils/include.js';

import './layouts/floating-navigation.js'
import './layouts/header.js';
import './layouts/chatbot.js';
import './layouts/footer.js';


fetch('/data/product.json')
    .then(res => res.json())
    .then(data => localStorage.setItem('products_data', JSON.stringify(data)));