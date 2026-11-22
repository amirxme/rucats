import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Camera,
  Cat,
  Compass,
  MapPin,
  Heart,
  Home,
  Menu,
  Moon,
  Pencil,
  MessageCircle,
  MoreHorizontal,
  PawPrint,
  Plus,
  Search,
  Grid3X3,
  Share2,
  Sparkles,
  X,
  Sun,
} from "lucide-react";

const posts = [
  {
    id: 1,
    catId: "martin",
    author: "Маша и Плюша",
    handle: "@plusha_cat",
    time: "18 минут назад",
    avatar:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=160&q=85",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=85",
    text: "Кажется, Плюша официально заняла моё любимое кресло.",
    likes: 248,
    comments: 18,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    catId: "martin",
    author: "Барсик",
    handle: "@barsik_the_boss",
    time: "1 час назад",
    avatar:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=160&q=85",
    image:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=85",
    text: "Утренний патруль квартиры завершён. Всё под контролем.",
    likes: 391,
    comments: 27,
    liked: false,
    saved: false,
  },
];

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Не ломаем интерфейс, если браузер переполнен или запрещает запись.
  }
};

const emptyDraft = { text: "", catId: "martin", image: "" };
const emptyNewCatDraft = { name: "", age: "", breed: "", bio: "", image: "" };

const pluralize = (count, one, few, many) => {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
};

function App() {
  const [activeNav, setActiveNav] = useState("Лента");
  const [theme, setTheme] = useState(() => localStorage.getItem("rucats-theme") || "light");
  const [openPostMenu, setOpenPostMenu] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postsState, setPostsState] = useState(() => {
    const storedPosts = readStorage("rucats-posts", posts);
    return Array.isArray(storedPosts) ? storedPosts : posts;
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [profileView, setProfileView] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("martin");
  const [extraCats, setExtraCats] = useState(() => {
    const storedCats = readStorage("rucats-cats", []);
    return Array.isArray(storedCats) ? storedCats : [];
  });
  const [martinDeleted, setMartinDeleted] = useState(() => localStorage.getItem("rucats-martin-deleted") === "true");
  const [newCatDraft, setNewCatDraft] = useState(emptyNewCatDraft);
  const [userProfile, setUserProfile] = useState(() => readStorage("rucats-user-profile", { name: "Амир", bio: "Люблю котов, уютные вечера и хорошие истории.", city: "Москва" }));
  const [catProfile, setCatProfile] = useState(() => readStorage("rucats-cat-profile", { name: "Мартин", age: "1 год", bio: "Любит солнечные подоконники, коробки и командовать." }));
  const [editDraft, setEditDraft] = useState(null);

  useEffect(() => {
    writeStorage("rucats-user-profile", userProfile);
  }, [userProfile]);

  useEffect(() => {
    writeStorage("rucats-cat-profile", catProfile);
  }, [catProfile]);

  useEffect(() => {
    writeStorage("rucats-cats", extraCats);
  }, [extraCats]);

  useEffect(() => {
    try { localStorage.setItem("rucats-martin-deleted", String(martinDeleted)); } catch { /* ignore */ }
  }, [martinDeleted]);

  useEffect(() => {
    writeStorage("rucats-posts", postsState);
  }, [postsState]);

  useEffect(() => {
    try { localStorage.setItem("rucats-theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const cats = [...(martinDeleted ? [] : [{ id: "martin", ...catProfile, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=420&q=85" }]), ...extraCats];
  const activeCat = cats.find((cat) => cat.id === selectedCatId) || cats[0] || null;
  const activeCatPosts = activeCat ? postsState.filter((post) => post.catId === activeCat.id) : [];
  const todayLabel = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const closeComposer = () => {
    setShowComposer(false);
    setEditingPostId(null);
    setDraft(emptyDraft);
  };

  const openNewPost = () => {
    setEditingPostId(null);
    setDraft({ ...emptyDraft, catId: activeCat?.id || "" });
    setShowComposer(true);
  };

  const closeAddCat = () => {
    setShowAddCat(false);
    setNewCatDraft(emptyNewCatDraft);
  };

  const openProfileEditor = (type) => {
    if (type === "cat" && !activeCat) return;
    setEditDraft(type === "user" ? { type, ...userProfile } : { type, ...activeCat });
    setShowEditProfile(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (editDraft.type === "user") {
      setUserProfile({ name: editDraft.name.trim() || "Амир", bio: editDraft.bio.trim(), city: editDraft.city.trim() || "Москва" });
    } else {
      const updatedCat = { ...activeCat, name: editDraft.name.trim() || activeCat.name, age: editDraft.age.trim() || activeCat.age, breed: editDraft.breed || activeCat.breed, bio: editDraft.bio.trim() };
      if (activeCat.id === "martin") setCatProfile({ name: updatedCat.name, age: updatedCat.age, bio: updatedCat.bio });
      else setExtraCats((current) => current.map((cat) => cat.id === activeCat.id ? updatedCat : cat));
    }
    setShowEditProfile(false);
    setEditDraft(null);
  };

  const deleteCat = () => {
    if (!activeCat) return;
    if (!window.confirm(`Удалить профиль кота «${activeCat.name}»? Публикации этого кота останутся в ленте.`)) return;
    if (activeCat.id === "martin") setMartinDeleted(true);
    else setExtraCats((current) => current.filter((cat) => cat.id !== activeCat.id));
    const nextCat = cats.find((cat) => cat.id !== activeCat.id);
    setSelectedCatId(nextCat?.id || "martin");
    setProfileView(null);
    setShowEditProfile(false);
    setEditDraft(null);
  };

  const toggleLike = (postId) => {
    setPostsState((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleSaved = (postId) => {
    setPostsState((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const deletePost = (postId) => {
    if (!window.confirm("Удалить эту публикацию?")) return;
    setPostsState((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setOpenPostMenu(null);
  };

  const openPostEditor = (post) => {
    setEditingPostId(post.id);
    setDraft({ text: post.text, catId: post.catId || "martin", image: post.image });
    setOpenPostMenu(null);
    setShowComposer(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result.length > 1200000) {
        window.alert("Фото слишком большое. Выбери изображение размером до 1 МБ.");
        return;
      }
      setDraft((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const publishPost = (event) => {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text && !draft.image) return;
    const validCatId = cats.some((cat) => cat.id === draft.catId) ? draft.catId : null;
    const selectedCat = cats.find((cat) => cat.id === validCatId);

    if (editingPostId !== null) {
      setPostsState((currentPosts) => currentPosts.map((post) => post.id === editingPostId
          ? { ...post, text: text || `${selectedCat?.name || "Мой питомец"} сегодня снова в центре внимания.`, image: draft.image || post.image, catId: validCatId }
        : post
      ));
      closeComposer();
      return;
    }

    setPostsState((currentPosts) => [
      {
        id: Date.now(),
        author: "Амир",
        handle: "@amirxme",
        time: "только что",
        avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=85",
        image: draft.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
        catId: validCatId,
        text: text || `${selectedCat?.name || "Мой питомец"} сегодня снова в центре внимания.`,
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
      },
      ...currentPosts,
    ]);
    closeComposer();
  };

  const handleNewCatImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result.length > 1200000) {
        window.alert("Фото слишком большое. Выбери изображение размером до 1 МБ.");
        return;
      }
      setNewCatDraft((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addCat = (event) => {
    event.preventDefault();
    if (!newCatDraft.name.trim()) return;
    const newCat = { id: `cat-${Date.now()}`, name: newCatDraft.name.trim(), age: newCatDraft.age.trim() || "возраст не указан", breed: newCatDraft.breed.trim() || "порода не указана", bio: newCatDraft.bio.trim() || "Новый питомец rucats.", image: newCatDraft.image || "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=420&q=85" };
    setExtraCats((current) => [...current, newCat]);
    setSelectedCatId(newCat.id);
    closeAddCat();
  };

  const navigation = [
    { label: "Лента", icon: Home },
    { label: "Обзор", icon: Compass },
    { label: "Сохранённое", icon: Bookmark },
  ];

  const visiblePosts = activeNav === "Сохранённое"
    ? postsState.filter((post) => post.saved)
    : activeNav === "Обзор"
      ? [...postsState].sort((first, second) => second.likes - first.likes)
      : postsState;

  return (
    <div className={`app-shell ${theme === "dark" ? "app-shell--dark" : ""}`}>
      <aside className={`sidebar ${showMobileMenu ? "sidebar--open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <PawPrint size={23} strokeWidth={2.5} />
          </div>
          <span>rucats</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Меню</p>

          <nav className="main-nav">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                className={`nav-item ${activeNav === label ? "nav-item--active" : ""}`}
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setShowMobileMenu(false);
                }}
              >
                <Icon size={19} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-section sidebar-section--cats">
          <p className="sidebar-label">Мои коты</p>

          {cats.map((cat) => (
            <button className="cat-profile" key={cat.id} onClick={() => { setSelectedCatId(cat.id); setProfileView("cat"); setShowMobileMenu(false); }}>
              <img src={cat.image} alt={`Кот ${cat.name}`} />
              <span>
                <strong>{cat.name}</strong>
                <small>{cat.id === "martin" ? "мой любимец" : cat.breed}</small>
              </span>
              <MoreHorizontal size={17} />
            </button>
          ))}

          <button className="add-cat-button" onClick={() => { setNewCatDraft(emptyNewCatDraft); setShowAddCat(true); setShowMobileMenu(false); }}>
            <span className="add-cat-icon">
              <Plus size={17} />
            </span>
            Добавить кота
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="daily-note">
            <Sparkles size={18} />
            <p>
              <strong>Кот дня</strong>
              <span>Загляни в его профиль</span>
            </p>
            <button aria-label="Открыть кота дня">→</button>
          </div>

          <button className="profile-link" onClick={() => { setProfileView("user"); setShowMobileMenu(false); }}>
            <div className="profile-avatar">А</div>
            <span>
              <strong>{userProfile.name}</strong>
              <small>мой профиль</small>
            </span>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      {showMobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Закрыть меню"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            aria-label="Открыть меню"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={22} />
          </button>

          <div className="mobile-brand">
            <PawPrint size={20} />
            <span>rucats</span>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input placeholder="Найти кота, породу или историю" />
          </div>

          <div className="topbar-actions">
            <button className="icon-button theme-toggle" aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"} onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button className="icon-button" aria-label="Уведомления" onClick={() => setShowNotifications((current) => !current)}>
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            {showNotifications && (
              <div className="notifications-popover">
                <div className="notifications-header">
                  <strong>Уведомления</strong>
                  <button aria-label="Закрыть уведомления" onClick={() => setShowNotifications(false)}><X size={16} /></button>
                </div>
                <p className="notifications-empty">Пока уведомлений нет</p>
              </div>
            )}
            {activeNav === "Лента" && (
              <button className="publish-button" onClick={openNewPost}>
                <Plus size={18} />
                <span>Опубликовать</span>
              </button>
            )}
          </div>
        </header>

        <div className="content-column">
          {profileView ? (
            <section className="profile-page">
              <button className="back-button" onClick={() => setProfileView(null)}>
                <ArrowLeft size={17} /> Назад к ленте
              </button>

              {profileView === "user" ? (
                <>
                  <div className="profile-hero">
                    <div className="profile-large-avatar">А</div>
                    <div className="profile-identity">
                      <p className="eyebrow">Профиль участника</p>
                      <h1>{userProfile.name}</h1>
                      <p className="profile-handle">@amirxme</p>
                      <p className="profile-bio">{userProfile.bio}</p>
                      <div className="profile-meta"><MapPin size={14} /> {userProfile.city} <span>·</span> на rucats с недавних пор</div>
                    </div>
                    <button className="profile-edit-button" onClick={() => openProfileEditor("user")}><Pencil size={16} /> Редактировать</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>{cats.length}</strong><span>{pluralize(cats.length, "кот", "кота", "котов")}</span></div>
                    <div><strong>{postsState.filter((post) => post.author === "Амир").length}</strong><span>публикаций</span></div>
                    <div><strong>0</strong><span>подписчиков</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Мои коты</h2><p>Пушистые жители этого профиля</p></div></div>
                  <div className="profile-cats-list">
                    {cats.map((cat) => (
                      <button className="featured-cat-card" key={cat.id} onClick={() => { setSelectedCatId(cat.id); setProfileView("cat"); }}>
                        <img src={cat.image} alt={cat.name} />
                        <span><strong>{cat.name}</strong><small>{cat.id === "martin" ? "мой любимец" : cat.breed} · {cat.age}</small></span>
                        <ArrowLeft className="cat-card-arrow" size={18} />
                      </button>
                    ))}
                  </div>
                  <div className="profile-section-title profile-section-title--posts"><div><h2>Мои публикации</h2><p>Истории, которыми я поделился</p></div><Grid3X3 size={19} /></div>
                  <div className="profile-post-grid">
                    {postsState.filter((post) => post.author === "Амир").length ? postsState.filter((post) => post.author === "Амир").map((post) => <img key={post.id} src={post.image} alt={post.text} />) : <div className="profile-empty">Твои новые истории появятся здесь</div>}
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-hero profile-hero--cat">
                    <img className="cat-profile-large" src={activeCat.image} alt={activeCat.name} />
                    <div className="profile-identity">
                      <p className="eyebrow">Профиль кота</p>
                      <h1>{activeCat.name}</h1>
                      <p className="profile-handle">любимец дома</p>
                      <p className="profile-bio">{activeCat.bio}</p>
                      <div className="profile-meta"><MapPin size={14} /> {userProfile.city} <span>·</span> {activeCat.age}</div>
                    </div>
                    <button className="profile-edit-button" onClick={() => openProfileEditor("cat")}><Pencil size={16} /> Изменить</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>{activeCat.age}</strong><span>возраст</span></div>
                    <div><strong>{activeCatPosts.length}</strong><span>историй</span></div>
                    <div><strong>{activeCat.name}</strong><span>имя</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Истории {activeCat.name}</h2><p>Все важные истории о питомце</p></div><Grid3X3 size={19} /></div>
                  <div className="profile-post-grid">
                    {activeCatPosts.length ? activeCatPosts.map((post) => <img key={post.id} src={post.image} alt={post.text} />) : <div className="profile-empty">У {activeCat.name} пока нет историй</div>}
                  </div>
                </>
              )}
            </section>
          ) : (
          <>
          {activeNav === "Лента" && <section className="welcome-block">
            <div>
              <p className="eyebrow">{todayLabel}</p>
                <h1>Привет, {userProfile.name} <span>👋</span></h1>
              <p className="welcome-description">
                Что нового у твоих питомцев?
              </p>
            </div>

            <div className="welcome-decoration" aria-hidden="true">
              <div className="sun-shape" />
              <div className="decoration-cat">🐈</div>
              <PawPrint className="decoration-paw" size={24} />
            </div>
          </section>}

          {activeNav === "Лента" && (
            <section className="composer-card">
              <div className="composer-avatar">А</div>
              <button className="composer-placeholder" onClick={openNewPost}>
                Расскажи, что сегодня вытворяет твой кот...
              </button>
              <button className="composer-camera" aria-label="Добавить фото" onClick={openNewPost}>
                <Camera size={19} />
              </button>
            </section>
          )}

          {activeNav === "Обзор" && (
            <section className="overview-card">
              <div>
                <p className="eyebrow">Обзор сообщества</p>
                <h2>Самые популярные истории</h2>
                <p>Посты, которые сегодня понравились больше всего.</p>
              </div>
              <div className="overview-stats">
                <span><strong>{postsState.length}</strong> историй</span>
                <span><strong>{postsState.reduce((total, post) => total + post.likes, 0)}</strong> лайков</span>
              </div>
            </section>
          )}

          <div className="feed-header">
            <div>
              <h2>{activeNav === "Сохранённое" ? "Сохранённое" : activeNav === "Обзор" ? "Популярное сегодня" : "Свежие истории"}</h2>
              <p>{activeNav === "Сохранённое" ? "Посты, которые ты сохранил" : activeNav === "Обзор" ? "Сначала — самые популярные истории" : "Самое интересное от участников"}</p>
            </div>
            <button className="sort-button">
              {activeNav === "Обзор" ? "Популярные" : "Новые"}
              <span>⌄</span>
            </button>
          </div>

          <div className="feed">
            {visiblePosts.length ? visiblePosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-header">
                  <img className="post-avatar" src={post.avatar} alt={post.author} />
                  <div className="post-author">
                    <strong>{post.author}</strong>
                    <span>
                      {post.handle} · {post.time}
                    </span>
                  </div>
                  <button className="post-more" aria-label="Ещё" onClick={() => post.author === "Амир" && setOpenPostMenu((current) => current === post.id ? null : post.id)}>
                    <MoreHorizontal size={19} />
                  </button>
                  {openPostMenu === post.id && post.author === "Амир" && (
                    <div className="post-menu">
                      <button onClick={() => openPostEditor(post)}>Редактировать</button>
                      <button onClick={() => deletePost(post.id)}>Удалить публикацию</button>
                    </div>
                  )}
                </div>

                <p className="post-text">{post.text}</p>

                <div className="post-image-wrapper">
                  <img className="post-image" src={post.image} alt={post.text} />
                  <button className={`image-save-button ${post.saved ? "image-save-button--saved" : ""}`} aria-label={post.saved ? "Убрать из сохранённых" : "Сохранить"} onClick={() => toggleSaved(post.id)}>
                    <Bookmark size={18} fill={post.saved ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="post-actions">
                  <div className="post-action-group">
                    <button
                      className={`post-action ${post.liked ? "post-action--liked" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart size={19} fill={post.liked ? "currentColor" : "none"} />
                      {post.likes}
                    </button>
                    <button className="post-action">
                      <MessageCircle size={19} />
                      {post.comments}
                    </button>
                    <button className="post-action" aria-label="Поделиться">
                      <Share2 size={18} />
                    </button>
                  </div>
                  <span className="post-category">
                    <Cat size={15} />
                    котожизнь
                  </span>
                </div>
              </article>
            )) : <div className="profile-empty">Здесь пока ничего нет. Нажми на закладку у понравившегося поста.</div>}
          </div>

          <div className="load-more">
            <button>Показать ещё истории</button>
          </div>
          </>
          )}
        </div>
      </main>

      {showAddCat && (
        <div className="modal-backdrop" onMouseDown={closeAddCat}>
          <section className="composer-modal profile-editor-modal" role="dialog" aria-modal="true" aria-labelledby="add-cat-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div><p className="eyebrow">Новый питомец</p><h2 id="add-cat-title">Добавить кота</h2></div>
              <button className="modal-close" aria-label="Закрыть" onClick={closeAddCat}><X size={20} /></button>
            </div>
            <form onSubmit={addCat}>
              <label className="field-label" htmlFor="new-cat-name">Имя кота</label>
              <input className="profile-input" id="new-cat-name" value={newCatDraft.name} onChange={(event) => setNewCatDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Например, Сёма" autoFocus />
              <div className="modal-form-row">
                <div><label className="field-label" htmlFor="new-cat-age">Возраст</label><input className="profile-input" id="new-cat-age" value={newCatDraft.age} onChange={(event) => setNewCatDraft((current) => ({ ...current, age: event.target.value }))} placeholder="2 года" /></div>
                <div><label className="field-label" htmlFor="new-cat-breed">Порода</label><input className="profile-input" id="new-cat-breed" value={newCatDraft.breed} onChange={(event) => setNewCatDraft((current) => ({ ...current, breed: event.target.value }))} placeholder="Британец" /></div>
              </div>
              <label className="field-label" htmlFor="new-cat-bio">О питомце</label>
              <textarea id="new-cat-bio" value={newCatDraft.bio} onChange={(event) => setNewCatDraft((current) => ({ ...current, bio: event.target.value }))} rows="3" placeholder="Какой у него характер?" />
              <label className="upload-field cat-photo-upload">
                <input type="file" accept="image/*" onChange={handleNewCatImage} />
                <Camera size={18} />
                <span>{newCatDraft.image ? "Фото выбрано — заменить" : "Добавить фото кота"}</span>
              </label>
              {newCatDraft.image && <img className="upload-preview cat-upload-preview" src={newCatDraft.image} alt="Предпросмотр фото кота" />}
              <div className="modal-footer"><button type="button" className="modal-cancel" onClick={closeAddCat}>Отмена</button><button type="submit" className="modal-submit" disabled={!newCatDraft.name.trim()}>Добавить кота</button></div>
            </form>
          </section>
        </div>
      )}

      {showEditProfile && editDraft && (
        <div className="modal-backdrop" onMouseDown={() => setShowEditProfile(false)}>
          <section className="composer-modal profile-editor-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Настройки профиля</p>
                <h2 id="edit-profile-title">{editDraft.type === "user" ? "Редактировать профиль" : `Редактировать профиль ${activeCat.name}`}</h2>
              </div>
              <button className="modal-close" aria-label="Закрыть" onClick={() => setShowEditProfile(false)}><X size={20} /></button>
            </div>
            <form onSubmit={saveProfile}>
              <label className="field-label" htmlFor="edit-name">{editDraft.type === "user" ? "Имя" : "Имя кота"}</label>
              <input className="profile-input" id="edit-name" value={editDraft.name} onChange={(event) => setEditDraft((current) => ({ ...current, name: event.target.value }))} />
              {editDraft.type === "user" ? (
                <>
                  <label className="field-label" htmlFor="edit-city">Город</label>
                  <input className="profile-input" id="edit-city" value={editDraft.city} onChange={(event) => setEditDraft((current) => ({ ...current, city: event.target.value }))} />
                </>
              ) : (
                <>
                  <label className="field-label" htmlFor="edit-age">Возраст</label>
                  <input className="profile-input" id="edit-age" value={editDraft.age} onChange={(event) => setEditDraft((current) => ({ ...current, age: event.target.value }))} />
                </>
              )}
              <label className="field-label" htmlFor="edit-bio">Описание</label>
              <textarea id="edit-bio" value={editDraft.bio} onChange={(event) => setEditDraft((current) => ({ ...current, bio: event.target.value }))} rows="4" />
              <div className="modal-footer">
                {editDraft.type === "cat" && <button type="button" className="modal-delete" onClick={deleteCat}>Удалить кота</button>}
                <button type="button" className="modal-cancel" onClick={() => setShowEditProfile(false)}>Отмена</button>
                <button type="submit" className="modal-submit">Сохранить</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showComposer && (
        <div className="modal-backdrop" onMouseDown={closeComposer}>
          <section className="composer-modal" role="dialog" aria-modal="true" aria-labelledby="composer-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">{editingPostId !== null ? "Редактирование" : "Новая история"}</p>
                <h2 id="composer-title">{editingPostId !== null ? "Изменить историю" : "Расскажи о своём коте"}</h2>
              </div>
              <button className="modal-close" aria-label="Закрыть" onClick={closeComposer}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={publishPost}>
              <label className="field-label" htmlFor="post-text">Текст поста</label>
              <textarea
                id="post-text"
                value={draft.text}
                onChange={(event) => setDraft((current) => ({ ...current, text: event.target.value }))}
                placeholder={`Что сегодня вытворяет ${cats.find((cat) => cat.id === draft.catId)?.name || "твой кот"}?`}
                rows="4"
              />

              <div className="modal-form-row">
                <div className="select-field">
                  <label className="field-label" htmlFor="post-cat">Кот</label>
                  <select id="post-cat" value={cats.some((cat) => cat.id === draft.catId) ? draft.catId : ""} onChange={(event) => setDraft((current) => ({ ...current, catId: event.target.value }))}>
                    {!cats.length && <option value="">Без привязки к коту</option>}
                    {cats.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <label className="upload-field">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <Camera size={18} />
                  <span>{draft.image ? "Фото выбрано" : "Добавить фото"}</span>
                </label>
              </div>

              {draft.image && <img className="upload-preview" src={draft.image} alt="Предпросмотр публикации" />}

              <div className="modal-footer">
                <button type="button" className="modal-cancel" onClick={closeComposer}>Отмена</button>
                <button type="submit" className="modal-submit" disabled={!draft.text.trim() && !draft.image}>{editingPostId !== null ? "Сохранить изменения" : "Опубликовать"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
