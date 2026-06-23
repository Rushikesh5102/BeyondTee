const fs = require('fs');
const file = 'src/components/layout/CommunitySection.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace('Twitter', 'Mail');
txt = txt.replace('Twitter', 'Mail'); // replace second instance

const newImages = const FEED_IMAGES = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', likes: '1.2k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', likes: '850' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop', likes: '2.1k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-13838ab84617?q=80&w=1000&auto=format&fit=crop', likes: '560' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop', likes: '3.4k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop', likes: '920' },
];;

txt = txt.replace(/const FEED_IMAGES = \[(.|\n)*?\];/, newImages);

txt = txt.replace(/@beyondtee\.studio/g, '@beyondtee_');
txt = txt.replace(/#wearyourmind/, 'Contact Us');
txt = txt.replace('#', 'https://www.instagram.com/beyondtee_');
txt = txt.replace('#', 'mailto:info@beyondtee.in');

txt = txt.replace(/<img(.*?)>/, <img/>); // just safe check

fs.writeFileSync(file, txt);
