-- ─── Showcase / Visual Feed ───

CREATE TABLE showcase_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  caption TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_showcase_posts_creator ON showcase_posts(creator_id);
CREATE INDEX idx_showcase_posts_published ON showcase_posts(published);
CREATE INDEX idx_showcase_posts_created ON showcase_posts(created_at DESC);
CREATE INDEX idx_showcase_posts_tags ON showcase_posts USING GIN(tags);

ALTER TABLE showcase_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON showcase_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Creators can read own posts"
  ON showcase_posts FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = showcase_posts.creator_id));

CREATE POLICY "Creators can insert own posts"
  ON showcase_posts FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM creators WHERE id = showcase_posts.creator_id));

CREATE POLICY "Creators can update own posts"
  ON showcase_posts FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = showcase_posts.creator_id));

CREATE POLICY "Creators can delete own posts"
  ON showcase_posts FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM creators WHERE id = showcase_posts.creator_id));

-- ─── Showcase Media ───

CREATE TABLE showcase_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES showcase_posts(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_showcase_media_post ON showcase_media(post_id);

ALTER TABLE showcase_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media of published posts"
  ON showcase_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM showcase_posts WHERE showcase_posts.id = showcase_media.post_id AND showcase_posts.published = true));

CREATE POLICY "Creators can read own media"
  ON showcase_media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM showcase_posts
    JOIN creators ON creators.id = showcase_posts.creator_id
    WHERE showcase_posts.id = showcase_media.post_id AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can insert media for own posts"
  ON showcase_media FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM showcase_posts
    JOIN creators ON creators.id = showcase_posts.creator_id
    WHERE showcase_posts.id = showcase_media.post_id AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can delete own media"
  ON showcase_media FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM showcase_posts
    JOIN creators ON creators.id = showcase_posts.creator_id
    WHERE showcase_posts.id = showcase_media.post_id AND creators.user_id = auth.uid()
  ));

-- ─── Showcase Likes ───

CREATE TABLE showcase_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES showcase_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_showcase_likes_post ON showcase_likes(post_id);
CREATE INDEX idx_showcase_likes_user ON showcase_likes(user_id);

ALTER TABLE showcase_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes"
  ON showcase_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON showcase_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own likes"
  ON showcase_likes FOR DELETE
  USING (auth.uid() = user_id);
