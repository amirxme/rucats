import { useState } from "react";
import {
  Bell,
  Bookmark,
  Camera,
  Cat,
  Compass,
  Heart,
  Home,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PawPrint,
  Plus,
  Search,
  Share2,
  Sparkles,
  UserRound,
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

          <button className="cat-profile">
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

          <button className="profile-link">
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
            <button className="publish-button">
              <Plus size={18} />
              <span>Опубликовать</span>
            </button>
          </div>
        </header>

        <div className="content-column">
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
            <button className="composer-placeholder">
              Расскажи, что сегодня вытворяет твой кот...
            </button>
            <button className="composer-camera" aria-label="Добавить фото">
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
        </div>
      </main>
    </div>
  );
}

export default App;
