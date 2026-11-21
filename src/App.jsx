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
  UserRound,
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

function App() {
  const [activeNav, setActiveNav] = useState("Лента");
  const [theme, setTheme] = useState(() => localStorage.getItem("rucats-theme") || "light");
  const [postsState, setPostsState] = useState(() => JSON.parse(localStorage.getItem("rucats-posts") || "null") || posts);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({ text: "", catId: "martin", image: "" });
  const [profileView, setProfileView] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("martin");
  const [extraCats, setExtraCats] = useState(() => JSON.parse(localStorage.getItem("rucats-cats") || "[]"));
  const [newCatDraft, setNewCatDraft] = useState({ name: "", age: "", breed: "", bio: "", image: "" });
  const [userProfile, setUserProfile] = useState(() => JSON.parse(localStorage.getItem("rucats-user-profile") || 'null') || { name: "Амир", bio: "Люблю котов, уютные вечера и хорошие истории.", city: "Москва" });
  const [catProfile, setCatProfile] = useState(() => JSON.parse(localStorage.getItem("rucats-cat-profile") || 'null') || { name: "Мартин", age: "1 год", bio: "Любит солнечные подоконники, коробки и командовать." });
  const [editDraft, setEditDraft] = useState(null);

  useEffect(() => {
    localStorage.setItem("rucats-user-profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("rucats-cat-profile", JSON.stringify(catProfile));
  }, [catProfile]);

  useEffect(() => {
    localStorage.setItem("rucats-cats", JSON.stringify(extraCats));
  }, [extraCats]);

  useEffect(() => {
    localStorage.setItem("rucats-posts", JSON.stringify(postsState));
  }, [postsState]);

  useEffect(() => {
    localStorage.setItem("rucats-theme", theme);
  }, [theme]);

  const cats = [{ id: "martin", ...catProfile, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=420&q=85" }, ...extraCats];
  const activeCat = cats.find((cat) => cat.id === selectedCatId) || cats[0];

  const openProfileEditor = (type) => {
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const publishPost = (event) => {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text && !draft.image) return;
    const selectedCat = cats.find((cat) => cat.id === draft.catId);

    setPostsState((currentPosts) => [
      {
        id: Date.now(),
        author: "Амир",
        handle: "@amirxme",
        time: "только что",
        avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=85",
        image: draft.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
        catId: draft.catId,
        text: text || `${selectedCat?.name || "Мой кот"} сегодня снова главный босс.`,
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
      },
      ...currentPosts,
    ]);
    setDraft({ text: "", catId: "martin", image: "" });
    setShowComposer(false);
  };

  const handleNewCatImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewCatDraft((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const addCat = (event) => {
    event.preventDefault();
    if (!newCatDraft.name.trim()) return;
    const newCat = { id: `cat-${Date.now()}`, name: newCatDraft.name.trim(), age: newCatDraft.age.trim() || "возраст не указан", breed: newCatDraft.breed.trim() || "порода не указана", bio: newCatDraft.bio.trim() || "Новый пушистый житель rucats.", image: newCatDraft.image || "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=420&q=85" };
    setExtraCats((current) => [...current, newCat]);
    setNewCatDraft({ name: "", age: "", breed: "", bio: "", image: "" });
    setShowAddCat(false);
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
                <small>{cat.id === "martin" ? "мой главный босс" : cat.breed}</small>
              </span>
              <MoreHorizontal size={17} />
            </button>
          ))}

          <button className="add-cat-button" onClick={() => { setShowAddCat(true); setShowMobileMenu(false); }}>
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
              <span>Уже заглядывали?</span>
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
            <button className="icon-button" aria-label="Уведомления">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <button className="publish-button" onClick={() => { setDraft((current) => ({ ...current, catId: selectedCatId })); setShowComposer(true); }}>
              <Plus size={18} />
              <span>Опубликовать</span>
            </button>
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
                      <div className="profile-meta"><MapPin size={14} /> {userProfile.city} <span>·</span> на rucats недавно</div>
                    </div>
                    <button className="profile-edit-button" onClick={() => openProfileEditor("user")}><Pencil size={16} /> Редактировать</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>{cats.length}</strong><span>кот{cats.length === 1 ? "" : "а"}</span></div>
                    <div><strong>{postsState.filter((post) => post.author === "Амир").length}</strong><span>публикаций</span></div>
                    <div><strong>0</strong><span>подписчиков</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Мои коты</h2><p>Пушистые хозяева этого профиля</p></div></div>
                  <div className="profile-cats-list">
                    {cats.map((cat) => (
                      <button className="featured-cat-card" key={cat.id} onClick={() => { setSelectedCatId(cat.id); setProfileView("cat"); }}>
                        <img src={cat.image} alt={cat.name} />
                        <span><strong>{cat.name}</strong><small>{cat.id === "martin" ? "мой главный босс" : cat.breed} · {cat.age}</small></span>
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
                      <p className="profile-handle">главный босс дома</p>
                      <p className="profile-bio">{activeCat.bio}</p>
                      <div className="profile-meta"><MapPin size={14} /> {userProfile.city} <span>·</span> {activeCat.age}</div>
                    </div>
                    <button className="profile-edit-button" onClick={() => openProfileEditor("cat")}><Pencil size={16} /> Изменить</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>{activeCat.age}</strong><span>возраст</span></div>
                    <div><strong>{postsState.length}</strong><span>историй</span></div>
                    <div><strong>{activeCat.name}</strong><span>имя</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Истории {activeCat.name}</h2><p>Всё самое важное о главном боссе</p></div><Grid3X3 size={19} /></div>
                  <div className="profile-post-grid">
                    {postsState.filter((post) => post.catId === activeCat.id).length ? postsState.filter((post) => post.catId === activeCat.id).map((post) => <img key={post.id} src={post.image} alt={post.text} />) : <div className="profile-empty">У {activeCat.name} пока нет историй</div>}
                  </div>
                </>
              )}
            </section>
          ) : (
          <>
          <section className="welcome-block">
            <div>
              <p className="eyebrow">Четверг, 19 ноября</p>
              <h1>Привет, Амир <span>👋</span></h1>
              <p className="welcome-description">
                Что нового у твоего пушистого друга?
              </p>
            </div>

            <div className="welcome-decoration" aria-hidden="true">
              <div className="sun-shape" />
              <div className="decoration-cat">🐈</div>
              <PawPrint className="decoration-paw" size={24} />
            </div>
          </section>

          <section className="composer-card">
            <div className="composer-avatar">А</div>
            <button className="composer-placeholder" onClick={() => { setDraft((current) => ({ ...current, catId: selectedCatId })); setShowComposer(true); }}>
              Расскажи, что сегодня вытворяет твой кот...
            </button>
            <button className="composer-camera" aria-label="Добавить фото" onClick={() => { setDraft((current) => ({ ...current, catId: selectedCatId })); setShowComposer(true); }}>
              <Camera size={19} />
            </button>
          </section>

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
              <p>{activeNav === "Сохранённое" ? "Посты, которые ты сохранил" : activeNav === "Обзор" ? "Сначала самые любимые истории" : "Самое интересное от сообщества"}</p>
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
                  <button className="post-more" aria-label="Ещё">
                    <MoreHorizontal size={19} />
                  </button>
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
        <div className="modal-backdrop" onMouseDown={() => setShowAddCat(false)}>
          <section className="composer-modal profile-editor-modal" role="dialog" aria-modal="true" aria-labelledby="add-cat-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div><p className="eyebrow">Новый житель</p><h2 id="add-cat-title">Добавить кота</h2></div>
              <button className="modal-close" aria-label="Закрыть" onClick={() => setShowAddCat(false)}><X size={20} /></button>
            </div>
            <form onSubmit={addCat}>
              <label className="field-label" htmlFor="new-cat-name">Имя кота</label>
              <input className="profile-input" id="new-cat-name" value={newCatDraft.name} onChange={(event) => setNewCatDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Например, Сёма" autoFocus />
              <div className="modal-form-row">
                <div><label className="field-label" htmlFor="new-cat-age">Возраст</label><input className="profile-input" id="new-cat-age" value={newCatDraft.age} onChange={(event) => setNewCatDraft((current) => ({ ...current, age: event.target.value }))} placeholder="2 года" /></div>
                <div><label className="field-label" htmlFor="new-cat-breed">Порода</label><input className="profile-input" id="new-cat-breed" value={newCatDraft.breed} onChange={(event) => setNewCatDraft((current) => ({ ...current, breed: event.target.value }))} placeholder="Британец" /></div>
              </div>
              <label className="field-label" htmlFor="new-cat-bio">О коте</label>
              <textarea id="new-cat-bio" value={newCatDraft.bio} onChange={(event) => setNewCatDraft((current) => ({ ...current, bio: event.target.value }))} rows="3" placeholder="Какой у него характер?" />
              <label className="upload-field cat-photo-upload">
                <input type="file" accept="image/*" onChange={handleNewCatImage} />
                <Camera size={18} />
                <span>{newCatDraft.image ? "Фото выбрано — заменить" : "Добавить фото кота"}</span>
              </label>
              {newCatDraft.image && <img className="upload-preview cat-upload-preview" src={newCatDraft.image} alt="Предпросмотр фото кота" />}
              <div className="modal-footer"><button type="button" className="modal-cancel" onClick={() => setShowAddCat(false)}>Отмена</button><button type="submit" className="modal-submit" disabled={!newCatDraft.name.trim()}>Добавить кота</button></div>
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
                <h2 id="edit-profile-title">{editDraft.type === "user" ? "Редактировать профиль" : `Редактировать ${activeCat.name}`}</h2>
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
                <button type="button" className="modal-cancel" onClick={() => setShowEditProfile(false)}>Отмена</button>
                <button type="submit" className="modal-submit">Сохранить</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showComposer && (
        <div className="modal-backdrop" onMouseDown={() => setShowComposer(false)}>
          <section className="composer-modal" role="dialog" aria-modal="true" aria-labelledby="composer-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Новая история</p>
                <h2 id="composer-title">Расскажи про своего кота</h2>
              </div>
              <button className="modal-close" aria-label="Закрыть" onClick={() => setShowComposer(false)}>
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
                  <select id="post-cat" value={draft.catId} onChange={(event) => setDraft((current) => ({ ...current, catId: event.target.value }))}>
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
                <button type="button" className="modal-cancel" onClick={() => setShowComposer(false)}>Отмена</button>
                <button type="submit" className="modal-submit" disabled={!draft.text.trim() && !draft.image}>Опубликовать</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
