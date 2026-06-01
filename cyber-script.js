(function(){
var S='https://docs.google.com/spreadsheets/d/e/2PACX-1vRo9gfrnnGDGrLkMN6S3n3Hn0EklyBdtp13ZhZQO1vx-19WR5x84oKRvmKxJxUf042hvyNZNO5HnKGF/pub?gid=0&single=true&output=csv',cache=null,map={},all=[],currentPage=0,perPage=12,currentFilter='all';

window.scrollKategori=function(d){var w=document.getElementById('categoryWrapper');if(!w)return;w.scrollBy({left:d==='left'?-200:200,behavior:'smooth'});};
window.clearProducts=function(){document.getElementById('mainProductGrid').innerHTML='';document.getElementById('paginationContainer').style.display='none';document.getElementById('closeBtnContainer').style.display='none';document.querySelectorAll('.cat-chip').forEach(function(c){c.classList.remove('active');});};
function esc(s){if(!s)return'';var d=document.createElement('div');d.appendChild(document.createTextNode(s));return d.innerHTML;}
function parseCSV(csv){var rows=[],cur=[],f='',q=false;for(var i=0;i<csv.length;i++){var ch=csv[i];if(q){if(ch==='"'){if(i+1<csv.length&&csv[i+1]==='"'){f+='"';i++;}else{q=false;}}else{f+=ch;}}else{if(ch==='"'){q=true;}else if(ch===','){cur.push(f.trim());f='';}else if(ch==='\r'){}else if(ch==='\n'){cur.push(f.trim());f='';if(cur.length>0)rows.push(cur);cur=[];}else{f+=ch;}}}if(f||cur.length>0){cur.push(f.trim());rows.push(cur);}if(rows.length===0)return[];var h=rows[0],p=[];for(var r=1;r<rows.length;r++){var v=rows[r],o={};for(var j=0;j<h.length;j++)o[h[j]]=j<v.length?v[j]:'';if(o.Name)p.push(o);}return p;}
function fetch(cb){if(cache){cb(cache);return;}var x=new XMLHttpRequest();x.open('GET',S,true);x.onload=function(){if(x.status===200){cache=parseCSV(x.responseText);all=cache;cb(cache);}else{cb([]);}};x.onerror=function(){cb([]);};x.send();}

function renderPage(){
var filtered=currentFilter==='all'?all:all.filter(function(p){return p.Category===currentFilter;});
var totalPages=Math.ceil(filtered.length/perPage)||1;
if(currentPage>=totalPages)currentPage=0;
var start=currentPage*perPage;
var page=filtered.slice(start,start+perPage);
var g=document.getElementById('mainProductGrid');
g.innerHTML='';
if(page.length===0){g.innerHTML='<p class="empty-text">◆ Tidak ada produk</p>';document.getElementById('paginationContainer').style.display='none';document.getElementById('closeBtnContainer').style.display='none';return;}
map={};
page.forEach(function(p,i){var idx=start+i;map[idx]=p;var t=p.Toco||p.toco||'https://tokopedia.com/cyberline';var c=document.createElement('div');c.className='product-card';c.innerHTML=(p.Badge?'<div class="product-badge">'+esc(p.Badge)+'</div>':'')+'<img src="'+(p.Image||'https://via.placeholder.com/400/0a0a0a/ffff00?text=NO+IMAGE')+'" class="product-img" alt="'+esc(p.Name)+'"><div class="product-info"><h4>'+esc(p.Name||'Tanpa Nama')+'</h4>'+(p.ShortSpecs?'<p class="product-short-specs">'+esc(p.ShortSpecs)+'</p>':'')+'<div class="product-price">'+(p.PriceOld?'<span class="price-old">Rp '+parseInt(p.PriceOld).toLocaleString('id-ID')+'</span>':'')+'<span class="price-current">Rp '+parseInt(p.Price).toLocaleString('id-ID')+'</span></div><p class="product-stock">🟢 Stok: '+esc(p.Stock||'0')+'</p><button class="btn-spec-full" data-idx="'+idx+'">Spesifikasi</button><div class="btn-action-row"><a class="btn-buy" href="https://wa.me/6281918138997?text='+encodeURIComponent('Halo, saya ingin pesan '+p.Name)+'" target="_blank">Order</a><a class="btn-toco" href="'+esc(t)+'" target="_blank">Toco</a></div></div>'; (function(idx2){c.querySelector('.btn-spec-full').addEventListener('click',function(){var p2=map[idx2];if(!p2)return;var h='<button class="c-modal-close" onclick="event.stopPropagation();tutupPopUp(true);">✕</button><h3 style="color:#ffff00;font-family:Orbitron,sans-serif;margin-bottom:15px;font-size:1.1rem;text-transform:uppercase;">'+esc(p2.Name)+'</h3>';if(p2.Specs){var pairs=p2.Specs.split('|');for(var s=0;s<pairs.length;s++){var ci=pairs[s].indexOf(':');if(ci===-1)continue;h+='<div class="spec-line"><span>'+esc(pairs[s].substring(0,ci).trim())+'</span><span>'+esc(pairs[s].substring(ci+1).trim())+'</span></div>';}}if(p2.Note)h+='<p style="color:rgba(255,255,0,0.6);font-size:0.7rem;margin-top:15px;font-style:italic;">* '+esc(p2.Note)+'</p>';document.getElementById('c-isi').innerHTML=h;document.getElementById('cyberPopUp').style.display='flex';document.body.style.overflow='hidden';});})(idx);g.appendChild(c);});
document.getElementById('closeBtnContainer').style.display='block';
var pc=document.getElementById('paginationContainer');
if(totalPages>1){pc.style.display='flex';document.getElementById('pageInfo').textContent=(currentPage+1)+'/'+totalPages;document.getElementById('prevPage').disabled=currentPage===0;document.getElementById('nextPage').disabled=currentPage>=totalPages-1;}else{pc.style.display='none';}
}

window.changePage=function(dir){currentPage+=dir;renderPage();};
function renderProducts(filter){currentFilter=filter;currentPage=0;var doSort=function(){if(currentFilter==='all'){var withBadge=[],withoutBadge=[];all.forEach(function(p){if(p.Badge){withBadge.push(p);}else{withoutBadge.push(p);}});withoutBadge.sort(function(){return Math.random()-0.5;});all=withBadge.concat(withoutBadge);}renderPage();};if(all.length===0){fetch(function(){doSort();});}else{doSort();}}
window.tutupPopUp=function(e){if(e===true||e.target.id==='cyberPopUp'){document.getElementById('cyberPopUp').style.display='none';document.body.style.overflow='auto';}};
function loadCategories(){var src=document.getElementById('embed12');var target=document.getElementById('categoryFilters');if(src&&target){target.innerHTML='';target.innerHTML=src.innerHTML;var chips=document.querySelectorAll('.cat-chip');for(var c=0;c<chips.length;c++){(function(ch){ch.addEventListener('click',function(){for(var j=0;j<chips.length;j++)chips[j].classList.remove('active');ch.classList.add('active');renderProducts(ch.getAttribute('data-cat'));});})(chips[c]);}}}
setTimeout(loadCategories,500);
setTimeout(function(){renderProducts('all');},600);
var slider=document.getElementById('categoryWrapper');var isDown=false,startX,scrollLeft;
slider.addEventListener('mousedown',function(e){isDown=true;slider.style.cursor='grabbing';startX=e.pageX-slider.offsetLeft;scrollLeft=slider.scrollLeft;});
slider.addEventListener('mouseleave',function(){isDown=false;slider.style.cursor='grab';});
slider.addEventListener('mouseup',function(){isDown=false;slider.style.cursor='grab';});
slider.addEventListener('mousemove',function(e){if(!isDown)return;e.preventDefault();var x=e.pageX-slider.offsetLeft;slider.scrollLeft=scrollLeft-(x-startX)*2;});
slider.style.cursor='grab';
})();