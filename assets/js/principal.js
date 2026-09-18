/* Interações da Só Cadente — estrutura visual adaptada da referência. */
document.addEventListener('DOMContentLoaded', async () => {
  const $ = selector => document.querySelector(selector);
  const formatPrice = value => value === null || value === undefined || value === '' ? 'Sob consulta' : `${Number(value).toLocaleString('pt-PT')} Kz`;
  const services = ['Limpeza Dentária','Clareamento Dental','Restaurações','Tratamento de Cáries','Extrações','Tratamento de Gengiva','Implantes Dentários','Próteses Dentárias','Aparelhos Ortodônticos','Endodontia (Canal)','Facetas de Porcelana','Odontopediatria','Reabilitação Oral','Dentes de Ouro','Lavagem Geral / Higiene Completa'];
  const icons = ['fa-tooth','fa-sun','fa-band-aid','fa-bacteria','fa-syringe','fa-heart-pulse','fa-screwdriver-wrench','fa-crown','fa-link','fa-magnifying-glass','fa-gem','fa-child-reaching','fa-rotate','fa-coins','fa-pump-soap'];
  const grid = $('#servicesGrid');
  if (grid) grid.innerHTML = services.map((service, index) => `<article class="servico-card reveal ${index === 2 ? 'featured' : ''} ${index > 5 ? 'service-extra' : ''}"><div class="servico-icon ${index === 2 ? 'feat-icon' : ''}"><i class="fa-solid ${icons[index]}"></i></div><h3 class="servico-title">${service}</h3><p class="servico-desc">Tratamento personalizado para a saúde, conforto e beleza do seu sorriso.</p><a href="#contacto" class="servico-link">Falar connosco <i class="fa-solid fa-arrow-right"></i></a></article>`).join('');
  const servicesToggle = $('#servicesToggle');
  servicesToggle?.addEventListener('click', () => { const expanded = grid.classList.toggle('expanded'); servicesToggle.setAttribute('aria-expanded', String(expanded)); servicesToggle.innerHTML = `${expanded ? 'Ver menos serviços' : 'Ver todos os serviços'} <i class="fa-solid fa-chevron-${expanded ? 'up' : 'down'}"></i>`; });

  const header = $('#cabecalho'); const progress = $('#scroll-progress');
  const updateScroll = () => { const y = window.scrollY; header?.classList.toggle('scrolled', y > 32); if (progress) progress.style.width = `${(y / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100}%`; };
  addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
  const hamburger = $('#hamburger'), mobileMenu = $('#mobile-menu');
  hamburger?.addEventListener('click', () => { const open = hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open', open); hamburger.setAttribute('aria-expanded', String(open)); });
  document.querySelectorAll('.mobile-nav-link,.mobile-cta').forEach(link => link.addEventListener('click', () => { hamburger?.classList.remove('open'); mobileMenu?.classList.remove('open'); }));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view', 'visible'); observer.unobserve(entry.target); } }), { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const modal = $('#projectModal'); const closeModal = () => modal?.classList.remove('open');
  $('#closeModal')?.addEventListener('click', closeModal); modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  const fallbackProjects = [{ titulo: 'Higiene completa', descricao: 'Lavagem geral e orientação de higiene oral.', categoria: 'Limpeza Dentária', preco: 8000, data: '2026-09-01' }, { titulo: 'Restauração estética', descricao: 'Recuperação de função e harmonia do sorriso.', categoria: 'Restaurações', preco: null, data: '2026-09-02' }];
  const imageFor = project => project.img || project.imagem_depois || 'assets/imagens/paciente-sorridente.svg';
  const card = project => { const beforeAfter = project.tipo_apresentacao === 'antes_depois'; const image = beforeAfter ? `<div class="project-before-after"><div><span>Antes</span><img src="${project.imagem_antes}" alt="Antes do tratamento" onerror="this.src='assets/imagens/trabalho-exemplo-1.svg'"></div><div><span>Depois</span><img src="${project.imagem_depois}" alt="Depois do tratamento" onerror="this.src='assets/imagens/trabalho-exemplo-2.svg'"></div></div>` : `<img src="${imageFor(project)}" alt="${project.titulo}" loading="lazy" onerror="this.src='assets/imagens/trabalho-exemplo-1.svg'">`; return `<article class="project-card reveal" data-id="${project.id || ''}" data-category="${project.categoria || ''}"><div class="card-img">${image}<div class="card-img-overlay"></div><span class="card-badge">${beforeAfter ? 'Antes e depois' : 'Resultado'}</span><span class="card-expand"><i class="fa-solid fa-expand"></i></span></div><div class="card-body"><div class="card-meta"><h3 class="card-title">${project.titulo}</h3><span class="card-year">${formatPrice(project.preco)}</span></div><p class="card-location"><i class="fa-solid fa-tooth"></i>${project.categoria || 'Tratamento'}</p></div></article>`; };
  const openProject = project => { $('#modalImage').src = imageFor(project); $('#modalImage').alt = project.titulo; $('#modalTitle').textContent = project.titulo; $('#modalDescription').textContent = project.descricao || ''; $('#modalCategory').textContent = project.categoria || 'Tratamento'; $('#modalYear').textContent = project.data || '—'; $('#modalLocation').textContent = formatPrice(project.preco); modal?.classList.add('open'); };
  let projects = fallbackProjects;
  try { const data = await SocadenteDB.list('projects'); if (data.length) projects = data; } catch (error) { console.info('Trabalhos disponíveis quando a ligação for estabelecida.', error); }
  projects.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));
  const projectsGrid = $('#projectsGrid');
  const renderProjects = filter => { if (!projectsGrid) return; const matching = filter === 'all' ? projects : projects.filter(project => project.categoria === filter); const selected = matching.slice(0, 3); projectsGrid.innerHTML = selected.length ? selected.map(card).join('') : '<p class="no-projects">Ainda não há trabalhos nesta categoria.</p>'; projectsGrid.querySelectorAll('.project-card').forEach(el => el.addEventListener('click', () => openProject(projects.find(project => String(project.id || '') === el.dataset.id) || selected.find(project => project.titulo === el.querySelector('.card-title').textContent)))); projectsGrid.querySelectorAll('.reveal').forEach(el => { el.classList.add('in-view', 'visible'); }); };
  renderProjects('all'); document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderProjects(button.dataset.filter); }));

  const fallbackPosts = [];
  let news = fallbackPosts, current = 0;
  try {
    const [publicationRows, galleryRows] = await Promise.all([SocadenteDB.list('news'), SocadenteDB.list('ads')]);
    news = [...(publicationRows || []), ...(galleryRows || []).map(item => ({ ...item, resumo: item.descricao || item.resumo, tipo: 'Galeria' }))]
      .filter(item => Boolean(item.carrossel))
      .sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));
  } catch (_) { console.info('Carrossel disponível quando a ligação for estabelecida.'); }
  const track = $('#noticias-track'), dots = $('#carousel-dots');
  const renderNews = () => {
    if (!track) return;
    if (!news.length) {
      track.innerHTML = '<p class="no-projects">Ainda não há publicações ou itens de galeria para o carrossel.</p>';
      $('#slide-atual').textContent = '0'; $('#slide-total').textContent = '0'; dots.innerHTML = ''; return;
    }
    const item = news[current];
    track.innerHTML = `<article class="noticia-card"><img src="${item.img || item.imagem || 'assets/imagens/sobre-consulta.svg'}" alt="${item.titulo}" loading="lazy"><div class="noticia-conteudo"><span class="noticia-meta">${item.tipo || item.categoria || 'Só Cadente'}</span><h3>${item.titulo}</h3><p>${item.resumo || item.descricao || ''}</p></div></article>`;
    $('#slide-atual').textContent = current + 1; $('#slide-total').textContent = news.length;
    dots.innerHTML = news.map((_, index) => `<button class="carousel-dot ${index === current ? 'active' : ''}" aria-label="Item ${index + 1}"></button>`).join('');
    dots.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => { current = index; renderNews(); }));
  };
  $('#noticias-prev')?.addEventListener('click', () => { if (!news.length) return; current = (current - 1 + news.length) % news.length; renderNews(); });
  $('#noticias-next')?.addEventListener('click', () => { if (!news.length) return; current = (current + 1) % news.length; renderNews(); }); renderNews();
  $('#formulario-contacto')?.addEventListener('submit', async event => { event.preventDefault(); const success = $('#form-success'); try { await SocadenteDB.insert('contact_requests', Object.fromEntries(new FormData(event.target))); success.classList.add('show'); event.target.reset(); } catch (_) { success.textContent = 'Não foi possível enviar agora. Fale connosco pelo WhatsApp: 935 976 620.'; success.classList.add('show'); } });
});
