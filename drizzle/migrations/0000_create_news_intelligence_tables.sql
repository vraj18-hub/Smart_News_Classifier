CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  title text NOT NULL,
  content text NOT NULL,
  source text NOT NULL DEFAULT 'Manual entry',
  category text NOT NULL DEFAULT 'World',
  sentiment text NOT NULL DEFAULT 'Neutral',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  is_demo boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read demo articles" ON public.articles FOR SELECT TO anon, authenticated USING (is_demo OR owner_id = auth.uid());
CREATE POLICY "Users can create articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update own articles" ON public.articles FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can delete own articles" ON public.articles FOR DELETE TO authenticated USING (owner_id = auth.uid());
CREATE INDEX articles_owner_created_idx ON public.articles (owner_id, created_at DESC);
CREATE INDEX articles_category_idx ON public.articles (category);

CREATE TABLE public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  owner_id uuid,
  category text NOT NULL,
  confidence double precision NOT NULL,
  sentiment text NOT NULL,
  sentiment_score double precision NOT NULL,
  keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  ngrams jsonb NOT NULL DEFAULT '{}'::jsonb,
  summaries jsonb NOT NULL DEFAULT '{}'::jsonb,
  cleaned_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.analyses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read demo analyses" ON public.analyses FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id AND (a.is_demo OR a.owner_id = auth.uid())));
CREATE POLICY "Users can create analyses" ON public.analyses FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update own analyses" ON public.analyses FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can delete own analyses" ON public.analyses FOR DELETE TO authenticated USING (owner_id = auth.uid());
CREATE INDEX analyses_article_idx ON public.analyses (article_id, created_at DESC);

INSERT INTO public.articles (id, title, content, source, category, sentiment, published_at, is_demo) VALUES
('10000000-0000-4000-8000-000000000001', 'European labs unveil lower-energy AI chips', 'A consortium of European research laboratories has unveiled a new class of artificial intelligence chips designed to reduce energy use in data centers. Early tests suggest the processors can run common language models while using substantially less electricity. Researchers say commercial trials will begin next year with several cloud providers.', 'Tech Wire', 'Technology', 'Positive', now() - interval '2 hours', true),
('10000000-0000-4000-8000-000000000002', 'Central banks signal a cautious path on rates', 'Central bank officials signaled that interest rate reductions will depend on sustained evidence that inflation is moving toward target. Markets reacted calmly as policymakers emphasized incoming employment and consumer price data. Economists expect a gradual approach through the next two quarters.', 'Market Ledger', 'Business', 'Neutral', now() - interval '5 hours', true),
('10000000-0000-4000-8000-000000000003', 'Coastal restoration project reaches key milestone', 'A decade-long coastal restoration effort has rebuilt wetlands across thirty kilometers of shoreline. The project has improved flood protection and created new habitats for migratory birds, according to environmental agencies. Local communities will help monitor water quality during the next phase.', 'World Journal', 'Science', 'Positive', now() - interval '1 day', true),
('10000000-0000-4000-8000-000000000004', 'National team advances after dramatic extra time', 'The national football team secured a place in the continental semifinal after scoring late in extra time. The match remained level through ninety minutes before a substitute converted a close-range chance. Coaches praised the squad’s resilience and defensive discipline.', 'Sport Daily', 'Sports', 'Positive', now() - interval '2 days', true),
('10000000-0000-4000-8000-000000000005', 'Hospitals expand remote monitoring program', 'Hospitals in three regions are expanding a remote patient monitoring program after a successful pilot. Connected devices allow clinicians to track recovery indicators from home and intervene earlier when readings change. Health officials say privacy safeguards remain central to the rollout.', 'Health Brief', 'Health', 'Neutral', now() - interval '3 days', true),
('10000000-0000-4000-8000-000000000006', 'Schools adopt new media literacy curriculum', 'Public schools will introduce a media literacy curriculum focused on source verification, manipulated images and responsible online participation. Teachers completed training this summer and classroom materials will be available for several age groups. The program will be reviewed after its first academic year.', 'Education Post', 'Education', 'Neutral', now() - interval '4 days', true);

INSERT INTO public.analyses (article_id, category, confidence, sentiment, sentiment_score, keywords, entities, topics, ngrams, summaries, cleaned_text) VALUES
('10000000-0000-4000-8000-000000000001','Technology',0.94,'Positive',0.88,'["AI chips","energy efficiency","data centers","language models","cloud providers"]','[{"text":"European","type":"LOCATION"},{"text":"next year","type":"DATE"}]','["efficient computing","artificial intelligence","cloud infrastructure"]','{"unigrams":["energy","chips","models"],"bigrams":["artificial intelligence","data centers"],"trigrams":["lower energy AI"]}','{"short":"European researchers introduced energy-efficient AI chips for data centers.","standard":"A European research consortium unveiled AI processors that use less electricity while running common language models. Commercial cloud trials are planned for next year.","bullets":["New chips target lower data-center energy use","Early tests covered common language models","Commercial trials begin next year"]}','european research laboratories unveiled artificial intelligence chips designed reduce energy use data centers'),
('10000000-0000-4000-8000-000000000002','Business',0.91,'Neutral',0.56,'["interest rates","inflation","employment data","consumer prices","central banks"]','[{"text":"next two quarters","type":"DATE"}]','["monetary policy","inflation outlook","financial markets"]','{"unigrams":["rates","inflation","data"],"bigrams":["central banks","interest rates"],"trigrams":["consumer price data"]}','{"short":"Central banks remain cautious about reducing interest rates.","standard":"Policymakers said rate cuts depend on continued evidence that inflation is returning to target. Economists expect measured moves over the next two quarters.","bullets":["Rate cuts remain data-dependent","Markets reacted calmly","Economists expect gradual easing"]}','central bank officials signaled interest rate reductions depend sustained inflation evidence'),
('10000000-0000-4000-8000-000000000003','Science',0.89,'Positive',0.91,'["coastal restoration","wetlands","flood protection","migratory birds","water quality"]','[{"text":"thirty kilometers","type":"LOCATION"},{"text":"a decade","type":"DATE"}]','["climate resilience","habitat recovery","community monitoring"]','{"unigrams":["wetlands","shoreline","habitats"],"bigrams":["flood protection","water quality"],"trigrams":["coastal restoration effort"]}','{"short":"Restored wetlands are improving coastal protection and wildlife habitat.","standard":"A decade-long project rebuilt wetlands along thirty kilometers of shoreline, strengthening flood protection and migratory bird habitats. Communities will monitor water quality next.","bullets":["Thirty kilometers of wetlands restored","Flood resilience has improved","Community monitoring begins next"]}','decade coastal restoration rebuilt wetlands shoreline improved flood protection habitats'),
('10000000-0000-4000-8000-000000000004','Sports',0.97,'Positive',0.93,'["continental semifinal","extra time","national team","defensive discipline","late goal"]','[{"text":"ninety minutes","type":"DATE"}]','["international football","tournament progress","team performance"]','{"unigrams":["team","match","goal"],"bigrams":["extra time","national team"],"trigrams":["place continental semifinal"]}','{"short":"A late extra-time goal sent the national team into the semifinal.","standard":"The national team advanced to the continental semifinal after a substitute scored in extra time. Coaches credited resilience and disciplined defending.","bullets":["Match was level after ninety minutes","A substitute scored the winner","Team advances to the semifinal"]}','national football team secured continental semifinal scoring late extra time'),
('10000000-0000-4000-8000-000000000005','Health',0.92,'Neutral',0.63,'["remote monitoring","connected devices","patient recovery","clinicians","privacy safeguards"]','[{"text":"three regions","type":"LOCATION"}]','["digital health","patient safety","hospital innovation"]','{"unigrams":["patients","devices","clinicians"],"bigrams":["remote monitoring","privacy safeguards"],"trigrams":["remote patient monitoring"]}','{"short":"Hospitals are expanding remote monitoring after a successful pilot.","standard":"Hospitals across three regions will use connected devices to monitor patients at home and intervene sooner. Officials emphasized privacy protections during expansion.","bullets":["The pilot produced positive results","Clinicians can track recovery remotely","Privacy remains a core safeguard"]}','hospitals regions expanding remote patient monitoring successful pilot connected devices'),
('10000000-0000-4000-8000-000000000006','Education',0.95,'Neutral',0.67,'["media literacy","source verification","manipulated images","teacher training","online participation"]','[{"text":"this summer","type":"DATE"},{"text":"first academic year","type":"DATE"}]','["digital literacy","education policy","online safety"]','{"unigrams":["schools","sources","teachers"],"bigrams":["media literacy","source verification"],"trigrams":["media literacy curriculum"]}','{"short":"Schools are introducing lessons on verifying online information.","standard":"A new media literacy curriculum will teach students to verify sources, recognize manipulated images and participate responsibly online. The program will be reviewed after one academic year.","bullets":["Curriculum covers source verification","Teachers completed summer training","Review follows the first academic year"]}','public schools introduce media literacy curriculum source verification manipulated images responsible online participation');