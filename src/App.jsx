import { useState } from "react";
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
} from "lucide-react";

const posts = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
];

function App() {
  const [activeNav, setActiveNav] = useState("Лента");
  const [postsState, setPostsState] = useState(posts);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({ text: "", cat: "Мартин", image: "" });
  const [profileView, setProfileView] = useState(null);

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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraft((current) => ({
      ...current,
      image: URL.createObjectURL(file),
    }));
  };

  const publishPost = (event) => {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text && !draft.image) return;

    setPostsState((currentPosts) => [
      {
        id: Date.now(),
        author: "Амир",
        handle: "@amirxme",
        time: "только что",
        avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=85",
        image: draft.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
        text: text || "Мой кот сегодня снова главный босс.",
        likes: 0,
        comments: 0,
        liked: false,
      },
      ...currentPosts,
    ]);
    setDraft({ text: "", cat: "Мартин", image: "" });
    setShowComposer(false);
  };

  const navigation = [
    { label: "Лента", icon: Home },
    { label: "Обзор", icon: Compass },
    { label: "Сохранённое", icon: Bookmark },
  ];

  return (
    <div className="app-shell">
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

          <button className="cat-profile" onClick={() => setProfileView("cat")}>
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&q=85"
              alt="Кот Мартин"
            />
            <span>
              <strong>Мартин</strong>
              <small>мой главный босс</small>
            </span>
            <MoreHorizontal size={17} />
          </button>

          <button className="add-cat-button">
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

          <button className="profile-link" onClick={() => setProfileView("user")}>
            <div className="profile-avatar">А</div>
            <span>
              <strong>Амир</strong>
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
            <button className="icon-button" aria-label="Уведомления">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <button className="publish-button" onClick={() => setShowComposer(true)}>
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
                      <h1>Амир</h1>
                      <p className="profile-handle">@amirxme</p>
                      <p className="profile-bio">Люблю котов, уютные вечера и хорошие истории.</p>
                      <div className="profile-meta"><MapPin size={14} /> Москва <span>·</span> на rucats недавно</div>
                    </div>
                    <button className="profile-edit-button"><Pencil size={16} /> Редактировать</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>1</strong><span>кот</span></div>
                    <div><strong>{postsState.filter((post) => post.author === "Амир").length}</strong><span>публикаций</span></div>
                    <div><strong>0</strong><span>подписчиков</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Мои коты</h2><p>Пушистые хозяева этого профиля</p></div></div>
                  <button className="featured-cat-card" onClick={() => setProfileView("cat")}>
                    <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=85" alt="Мартин" />
                    <span><strong>Мартин</strong><small>мой главный босс · 1 год</small></span>
                    <ArrowLeft className="cat-card-arrow" size={18} />
                  </button>
                  <div className="profile-section-title profile-section-title--posts"><div><h2>Мои публикации</h2><p>Истории, которыми я поделился</p></div><Grid3X3 size={19} /></div>
                  <div className="profile-post-grid">
                    {postsState.filter((post) => post.author === "Амир").length ? postsState.filter((post) => post.author === "Амир").map((post) => <img key={post.id} src={post.image} alt={post.text} />) : <div className="profile-empty">Твои новые истории появятся здесь</div>}
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-hero profile-hero--cat">
                    <img className="cat-profile-large" src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=420&q=85" alt="Мартин" />
                    <div className="profile-identity">
                      <p className="eyebrow">Профиль кота</p>
                      <h1>Мартин</h1>
                      <p className="profile-handle">главный босс дома</p>
                      <p className="profile-bio">Любит солнечные подоконники, коробки и командовать.</p>
                      <div className="profile-meta"><MapPin size={14} /> Москва <span>·</span> 1 год</div>
                    </div>
                    <button className="profile-edit-button"><Pencil size={16} /> Изменить</button>
                  </div>
                  <div className="profile-stats">
                    <div><strong>1</strong><span>год</span></div>
                    <div><strong>{postsState.length}</strong><span>историй</span></div>
                    <div><strong>Мартин</strong><span>имя</span></div>
                  </div>
                  <div className="profile-section-title"><div><h2>Истории Мартина</h2><p>Всё самое важное о главном боссе</p></div><Grid3X3 size={19} /></div>
                  <div className="profile-post-grid">
                    {postsState.map((post) => <img key={post.id} src={post.image} alt={post.text} />)}
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
            <button className="composer-placeholder" onClick={() => setShowComposer(true)}>
              Расскажи, что сегодня вытворяет твой кот...
            </button>
            <button className="composer-camera" aria-label="Добавить фото" onClick={() => setShowComposer(true)}>
              <Camera size={19} />
            </button>
          </section>

          <div className="feed-header">
            <div>
              <h2>Свежие истории</h2>
              <p>Самое интересное от сообщества</p>
            </div>
            <button className="sort-button">
              Новые
              <span>⌄</span>
            </button>
          </div>

          <div className="feed">
            {postsState.map((post) => (
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
                  <button className="image-save-button" aria-label="Сохранить">
                    <Bookmark size={18} />
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
            ))}
          </div>

          <div className="load-more">
            <button>Показать ещё истории</button>
          </div>
          </>
          )}
        </div>
      </main>

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
                placeholder="Что сегодня вытворяет Мартин?"
                rows="4"
              />

              <div className="modal-form-row">
                <div className="select-field">
                  <label className="field-label" htmlFor="post-cat">Кот</label>
                  <select id="post-cat" value={draft.cat} onChange={(event) => setDraft((current) => ({ ...current, cat: event.target.value }))}>
                    <option>Мартин</option>
                    <option>Другой кот</option>
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
