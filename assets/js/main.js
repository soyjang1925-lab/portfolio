/* ================================================
   PORTFOLIO JS — UI/UX Designer Publisher
   jQuery + GSAP + Swiper + AOS
   ================================================ */

$(function () {

  /* ── Custom Cursor ── */
  const $cursor  = $('.cursor');
  const $follower = $('.cursor-follower');

  if (window.innerWidth > 768) {
    let mX = 0, mY = 0, fX = 0, fY = 0;

    $(document).on('mousemove', function (e) {
      mX = e.clientX; mY = e.clientY;
      $cursor.css({ left: mX, top: mY });
    });

    (function animateFollower() {
      fX += (mX - fX) * 0.12;
      fY += (mY - fY) * 0.12;
      $follower.css({ left: fX, top: fY });
      requestAnimationFrame(animateFollower);
    })();

    $('a, button, .filter-btn, .project-card, .nav-toggle').on('mouseenter', function () {
      $cursor.addClass('expanded');
      $follower.addClass('expanded');
    }).on('mouseleave', function () {
      $cursor.removeClass('expanded');
      $follower.removeClass('expanded');
    });
  }

  /* ── Nav Scroll ── */
  $(window).on('scroll', function () {
    const st = $(this).scrollTop();
    if (st > 60) $('.nav').addClass('scrolled');
    else $('.nav').removeClass('scrolled');

    // Active nav link
    $('section[id]').each(function () {
      const top = $(this).offset().top - 100;
      const bot = top + $(this).outerHeight();
      const id  = $(this).attr('id');
      if (st >= top && st < bot) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });

  /* ── Smooth Scroll ── */
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const target = $($(this).attr('href'));
    if (target.length) {
      $('html, body').animate({ scrollTop: target.offset().top - 70 }, 800);
      // close mobile
      $('.nav-mobile').removeClass('open');
      $('.nav-toggle').removeClass('open');
    }
  });

  /* ── Mobile Nav ── */
  $('.nav-toggle').on('click', function () {
    $(this).toggleClass('open');
    $('.nav-mobile').toggleClass('open');
  });

  /* ── AOS Init ── */
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
  });

  /* ── GSAP Hero ── */
  if (typeof gsap !== 'undefined') {
    if ($('.hero-label').length) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-label',  { y: 30, opacity: 0, duration: 0.8 }, 0.3)
        .from('.hero-title',  { y: 60, opacity: 0, duration: 1.0 }, 0.5)
        .from('.hero-desc',   { y: 30, opacity: 0, duration: 0.8 }, 0.8)
        .from('.hero-cta',    { y: 30, opacity: 0, duration: 0.7 }, 1.0)
        .from('.hero-frame',  { x: 60, opacity: 0, duration: 1.0 }, 0.6)
        .from('.hero-stat',   { x: 40, opacity: 0, duration: 0.7 }, 0.9)
        .from('.hero-badge',  { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.1)
        .from('.hero-scroll', { y: 20, opacity: 0, duration: 0.6 }, 1.3);
    }

    // GSAP ScrollTrigger for skill bars
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      if ($('#about').length) {
        ScrollTrigger.create({
          trigger: '#about',
          start: 'top 70%',
          onEnter: function () {
            $('.skill-fill').each(function () {
              const pct = $(this).data('pct');
              $(this).css('width', pct + '%');
            });
          },
          once: true,
        });
      }
    } else {
      // Fallback: trigger on scroll
      if ($('#about').length) {
        $(window).on('scroll', function () {
          const aboutTop = $('#about').offset().top - 400;
          if ($(this).scrollTop() >= aboutTop) {
            $('.skill-fill').each(function () {
              const pct = $(this).data('pct');
              $(this).css('width', pct + '%');
            });
            $(window).off('scroll.skills');
          }
        });
      }
    }
  }

  /* ── Swiper ── */
  if (typeof Swiper !== 'undefined' && $('.projects-swiper').length) {
    const projectsSwiper = new Swiper('.projects-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 24,
      grabCursor: true,
      breakpoints: {
        640:  { slidesPerView: 1.5, spaceBetween: 24 },
        1024: { slidesPerView: 2.2, spaceBetween: 32 },
        1280: { slidesPerView: 2.6, spaceBetween: 40 },
      },
      on: {
        slideChange: function () { updatePagination(this); },
        init: function () { updatePagination(this); },
      },
    });

    function updatePagination(sw) {
      const cur = sw.realIndex + 1;
      const tot = sw.slides.length;
      $('.swiper-pagination-custom').html(
        `<span class="cur">${String(cur).padStart(2, '0')}</span> / ${String(tot).padStart(2, '0')}`
      );
    }

    $('#swiper-prev').on('click', function () { projectsSwiper.slidePrev(); });
    $('#swiper-next').on('click', function () { projectsSwiper.slideNext(); });
  }

  /* ── Projects Filter ── */
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('.project-card').each(function () {
      const cat = $(this).data('cat');
      if (filter === 'all' || cat === filter) {
        $(this).closest('.swiper-slide').show();
      } else {
        $(this).closest('.swiper-slide').hide();
      }
    });
    projectsSwiper.update();
  });

  /* ── Contact Form ── */
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    const $btn = $(this).find('.btn-submit span');
    $btn.text('Sending...');
    setTimeout(function () {
      $btn.text('Message Sent ✓');
      setTimeout(function () { $btn.text('Send Message'); }, 3000);
    }, 1500);
  });

  /* ── Number Counter Anim ── */
  function animCounter($el) {
    const target = parseInt($el.data('count'));
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $el.text(current + ($el.data('suffix') || ''));
    }, 30);
  }

  // Trigger counter when hero stat is visible
  let counterDone = false;
  $(window).on('scroll', function () {
    if (!counterDone && $(this).scrollTop() > 100) {
      $('.counter').each(function () { animCounter($(this)); });
      counterDone = true;
    }
  });
  // Trigger immediately if already scrolled
  if ($(window).scrollTop() > 100) {
    $('.counter').each(function () { animCounter($(this)); });
    counterDone = true;
  }
  // Hero stat counter on load
  setTimeout(function () {
    $('.hero-stat .counter').each(function () { animCounter($(this)); });
  }, 1200);

});
