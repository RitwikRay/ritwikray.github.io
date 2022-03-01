!function(n,t,e){console.log("init");var o={init:function(e){o.select2(),o.stellar(),o.carousel(),o.portfolio(),o.lightCase(),o.sideNav(),o.counter(),o.skills(),o.aos(),o.navbarChange()},select2:function(){n(e).ready(function(){n("select").select2()})},stellar:function(){var e=n(t).width();767<=e&&(n(".bg-fixed").attr("data-stellar-background-ratio","0.8"),n.stellar({horizontalScrolling:!1,responsive:!0,parallaxBackgrounds:!0,scrollProperty:"scroll"}))},carousel:function(){n(".testi-carousel").owlCarousel({loop:!0,margin:10,autoplay:!0,nav:!1,dots:!0,dotSpeed:1e3,autoplay:!0,autoplaySpeed:1e3,items:1}),n(".client-slider").owlCarousel({loop:!0,margin:10,nav:!0,navSpeed:1e3,dots:!1,autoplay:!0,autoplaySpeed:1e3,navText:['<span class="fa fa-angle-left"></span>','<span class="fa fa-angle-right"></span>'],responsive:{0:{items:1},600:{items:3},1e3:{items:6}}})},portfolio:function(){var t=n(".grid-portfolio").isotope({itemSelector:".grid-item",masonry:{gutter:".gutter-sizer",columnWidth:".grid-sizer"},percentPosition:!0});return n(".filter-button-group").on("click","a",function(){var e=n(this).attr("data-filter");t.isotope({filter:e})}),n(".btn-filter a.is-checked").addClass("active"),n(".btn-filter a").on("click",function(){n(".btn-filter a").removeClass("active"),n(this).addClass("active")}),!1},lightCase:function(){jQuery(e).ready(function(e){e("a[data-rel^=lightcase]").lightcase()})},sideNav:function(){n("#side-nav-open").click(function(){n("#side-nav").css("width","300"),setTimeout(function(){n("body").addClass("sidenav-open")},200),setTimeout(function(){n("body").addClass("in")},400)}),n("#side-nav-close, #canvas-overlay").click(function(){setTimeout(function(){n("body").removeClass("in")},200),setTimeout(function(){n("body").removeClass("sidenav-open"),n("#side-nav").css("width","0")},400)}),n("#side-search-open").click(function(){n("#side-search").css("width","300"),setTimeout(function(){n("body").addClass("sidesearch-open")},200),setTimeout(function(){n("body").addClass("in")},300)}),n("#side-search-close, #canvas-overlay").click(function(){setTimeout(function(){n("body").removeClass("in")},200),setTimeout(function(){n("body").removeClass("sidesearch-open"),n("#side-search").css("width","0")},300)})},counter:function(){n("#counter").each(function(){n(this).waypoint({handler:function(e){n(".number").countTo({speed:1e3}),this.destroy()},offset:"80%"})})},skills:function(){n("#skills").each(function(){return n(this).waypoint({handler:function(e){n(".progress").each(function(){console.log(n(this).attr("data-percent")),n(this).find(".progress-bar").delay(1e4).css({width:n(this).attr("data-percent")})})},offset:"80%"}),!1})},aos:function(){AOS.init({once:!0})},navbarChange:function(){n(t).scroll(function(){var e=n(t).scrollTop();return 150<e?(n("#header-navbar").removeClass("navbar-transparent"),n("body").addClass("not-on-top")):(n("body").removeClass("not-on-top"),n("#header-navbar").addClass("navbar-transparent")),!1})}};n(e).ready(function(){o.init(n)})}(window.jQuery,window,document);


const canvas = document.getElementById('canvas');

const texts = [
  'HTML5', 'Javascript','CSS', 'Python', 'Java',];
const counts = [1,2,4,5,4,2,1];

const options = {
  tilt: Math.PI / 9,
  initialVelocityX: 0.09,
  initialVelocityY: 0.09,
  initialRotationX: Math.PI * 0.14,
  initialRotationZ: 0
};

wordSphere(canvas, texts, counts, options);
 

function wordSphere(canvas, texts, counts, options) {
  const π = Math.PI; // happy math!
  const {
    width = 500,
    height = 500,
    radius = 150,
    padding = 50,
    fontSize = 22,
    tilt = 0,
    initialVelocityX = 0,
    initialVelocityY = 0,
    initialRotationX = 0,
    initialRotationZ = 0,
  } = options;
  
  let vx = initialVelocityX, vy = initialVelocityY;
  let rx = initialRotationX, rz = initialRotationZ;
  
  // canvas setup
  let ctx = canvas.getContext('2d'); 
  ctx.textAlign = 'center';
  
  // Hi-DPI support
  canvas.width = width * 2;
  canvas.height = height * 2;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(2,2); 

  // scrolling
  let clicked = false, lastX, lastY;
  canvas.addEventListener('mousedown', event => {
    clicked = true;
    lastX = event.screenX;
    lastY = event.screenY;
  });
  canvas.addEventListener('mousemove', event => {
    if (!clicked) return;
    [dx, dy] = [event.screenX - lastX, event.screenY - lastY];
    [lastX, lastY] = [event.screenX, event.screenY];

    // rotation update
    rz += -dy * 0.01;
    rx += dx * 0.01;

    // velocity update
    vx = dx * 0.1;
    vy = dy * 0.1;

    if (!looping) startLoop();
  });
  canvas.addEventListener('mouseup', e => clicked = false);
  canvas.addEventListener('mouseleave', e => clicked = false);
  
  function rot(x,y,t) {
    return [x*Math.cos(t)-y*Math.sin(t), x*Math.sin(t)+y*Math.cos(t)];
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ix = 0, iz = 0, i = 1;
    for (const text of texts) {
      const degZ = (π/(counts.length-1)) * iz;
      const degX = (2*π/counts[iz]) * ix;

      let x = radius * Math.sin(degZ) * Math.cos(degX);
      let y = radius * Math.sin(degZ) * Math.sin(degX); 
      let z = radius * Math.cos(degZ) + 8*(ix % 2) /* randomness */;

      // camera transform
      [y,z] = rot(y, z, tilt);
      [x,z] = rot(x, z, rz);
      [x,y] = rot(x, y, rx);

      // convert to cartesian and then draw.
      const alpha = 0.6 + 0.4 * (x/radius);
      const size = fontSize + 2 + 5*(x/radius);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.font = `${size}px "Helvetica Neue", sans-serif`;
      ctx.fillText(text, y + width/2, -z + height/2);

      ix--;
      if (ix < 0) {
        iz++;
        ix = counts[iz] - 1;
      }
      i++;
    }
  }

  // renderer
  let looping = false;
  function rendererLoop() {
    if (looping) window.requestAnimationFrame(rendererLoop);
    render();
    
    // deacceleration - dirty code xD
    if (vx > 0) vx = vx - 0.01;
    if (vy > 0) vy = vy - 0.01;
    if (vx < 0) vx = vx + 0.01;
    if (vy > 0) vy = vy + 0.01;
    if (vx == 0 && vy == 0) stopLoop();
    
    rz += vy * 0.01;
    rx += vx * 0.01;
  }

  function startLoop() {
    looping = true;
    window.requestAnimationFrame(rendererLoop);
  }

  function stopLoop() {
    looping = false;
  }
  startLoop();
}
