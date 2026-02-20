import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'framer-motion';

export default function RouteEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate'); // Initial state for new routes
  const [sammiescore, setSammiescore] = useState('');
  const [distanceKm, setDistanceKm] = useState('0');
  const [description, setDescription] = useState('');
  const [nodesStr, setNodesStr] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [guidanceType, setGuidanceType] = useState('Nodes');
  const [guidanceText, setGuidanceText] = useState('');

  // File State
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoute() {
      if (!id) return;

      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setTitle(data.title);
        setLocation(data.location);
        setDifficulty(data.difficulty);
        setSammiescore(data.sammiescore || '');
        setDistanceKm(data.distance_km ? data.distance_km.toString() : '0');
        setDescription(data.notes || '');
        setStartPoint(data.start_point || '');
        setGuidanceType(data.guidance_type || 'Nodes');
        setGuidanceText(data.guidance_text || '');
        if (data.nodes && Array.isArray(data.nodes)) {
          setNodesStr(data.nodes.map((n: { id: string }) => n.id).join(', '));
        }
      } else if (error) {
        console.error("Error fetching route for edit:", error);
      }
    }
    fetchRoute();
  }, [id]);

  const handleGpxDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.gpx')) {
        setGpxFile(file);
      } else {
        setError("Please upload a valid .gpx file.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let gpx_file_url = null;
      let cover_photo_url = null;

      // 1. Upload GPX File if present
      if (gpxFile) {
        const fileExt = gpxFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gpx_files')
          .upload(filePath, gpxFile);

        if (uploadError) {
          console.error("GPX Upload Error:", uploadError);
          throw new Error(`Storage Error (GPX upload): ${uploadError.message}. Did you enable INSERT access on the 'gpx_files' bucket?`);
        }

        const { data } = supabase.storage.from('gpx_files').getPublicUrl(filePath);
        gpx_file_url = data.publicUrl;
      }

      // 2. Upload Cover Photo if present
      if (coverPhoto) {
        const fileExt = coverPhoto.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cover_photos')
          .upload(filePath, coverPhoto);

        if (uploadError) {
          console.error("Cover Photo Upload Error:", uploadError);
          throw new Error(`Storage Error (Image upload): ${uploadError.message}. Did you enable INSERT access on the 'cover_photos' bucket?`);
        }

        const { data } = supabase.storage.from('cover_photos').getPublicUrl(filePath);
        cover_photo_url = data.publicUrl;
      }

      // 2b. Upload Gallery Photos if present
      const uploaded_gallery_urls: string[] = [];
      if (galleryFiles && galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('cover_photos')
            .upload(filePath, file);

          if (!uploadError) {
            const { data } = supabase.storage.from('cover_photos').getPublicUrl(filePath);
            uploaded_gallery_urls.push(data.publicUrl);
          }
        }
      }

      let parsedNodes = null;
      if (nodesStr.trim()) {
        parsedNodes = nodesStr.split(/[-,\n]+/).map(n => n.trim()).filter(n => n.length > 0).map(id => ({ id }));
      }

      // 3. Database Record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        title,
        location,
        difficulty,
        notes: description,
        distance_km: parseFloat(distanceKm) || 0,
        nodes: parsedNodes,
        start_point: startPoint,
        sammiescore: sammiescore,
        guidance_type: guidanceType,
        guidance_text: guidanceText
      };

      if (uploaded_gallery_urls.length > 0) {
        // fetch old ones if edit? For now just overwrite or append if possible. 
        // Since we might not have old ones loaded in state easily without another query or keeping it in state,
        // let's just set the new ones for now as MVP.
        payload.gallery_urls = uploaded_gallery_urls;
      }

      if (gpx_file_url) {
        payload.gpx_file_url = gpx_file_url;
        payload.route_type = 'GPX';
      } else if (!id) {
        // Only set route_type to Nodes on creation if no GPX
        payload.route_type = 'Nodes';
      }
      if (cover_photo_url) payload.cover_photo_url = cover_photo_url;

      let dbError;
      if (id) {
        // Update existing route
        const { error } = await supabase
          .from('routes')
          .update(payload)
          .eq('id', id);
        dbError = error;
      } else {
        // Create new route
        payload.user_id = user.id;
        const { error } = await supabase
          .from('routes')
          .insert(payload);
        dbError = error;
      }

      if (dbError) {
        console.error("Database Insert Error:", dbError);
        throw new Error(`Database Error (Routes Insert): ${dbError.message}. (SQL mismatch or invalid inputs)`);
      }

      // Success!
      navigate('/');

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred while saving the route.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{id ? 'Route Bewerken' : 'Nieuwe Route'}</h1>
      <p className="text-muted-foreground mb-8">Vul de routegegevens in om deze toe te voegen aan SammieWalk.</p>

      {error && (
        <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground p-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      <div className="bg-card border border-border/10 rounded-2xl p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
            Basisinformatie
          </h2>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Naam van de route *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                placeholder="Bijv. Boswandeling Zonnebeke"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Locatie *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Gemeente, Regio"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Niveau</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Easy">Makkelijk</option>
                  <option value="Moderate">Gemiddeld</option>
                  <option value="Hard">Moeilijk</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sammiescore</label>
                <input
                  type="text"
                  value={sammiescore}
                  onChange={e => setSammiescore(e.target.value)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Afstand (km) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={distanceKm}
                  onChange={e => setDistanceKm(e.target.value)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 12.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Startpunt / Parking</label>
              <input
                type="text"
                value={startPoint}
                onChange={e => setStartPoint(e.target.value)}
                className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                placeholder="Bijv. Parking de Hoge Veluwe, of Adres"
              />
            </div>

            <div className="space-y-4 border-t border-border/10 pt-6">
              <h3 className="font-semibold text-foreground">Hoe is deze route te volgen? *</h3>
              <select
                value={guidanceType}
                onChange={e => setGuidanceType(e.target.value)}
                className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="Nodes">Knooppunten</option>
                <option value="Signage">Bewegwijzerd</option>
                <option value="GPX_Only">Enkel GPX Track</option>
              </select>

              {guidanceType === 'Nodes' && (
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-muted-foreground">Knooppunten (gescheiden door streepje of komma)</label>
                  <input
                    type="text"
                    value={nodesStr}
                    onChange={e => setNodesStr(e.target.value)}
                    className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    placeholder="24 - 25 - 34 - 33 - 32"
                  />
                </div>
              )}

              {guidanceType === 'Signage' && (
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-muted-foreground">Over de bewegwijzering (vb. Volg de rode ruit)</label>
                  <input
                    type="text"
                    value={guidanceText}
                    onChange={e => setGuidanceText(e.target.value)}
                    className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    placeholder="Bijv. Volg de rode zeshoekige bordjes van Natuur en Bos."
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Omslagfoto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setCoverPhoto(e.target.files?.[0] || null)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Extra Foto's (Galerij)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setGalleryFiles(e.target.files)}
                  className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Beschrijving</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-32 bg-background border border-border/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Geef een korte omschrijving van de route, zoals hoogtepunten of de ondergrond."
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/10" />

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
            GPX-bestand
          </h2>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onDragOver={(e: React.DragEvent) => e.preventDefault()}
            onDrop={handleGpxDrop}
            className={`border-2 border-dashed transition-colors rounded-2xl p-12 flex flex-col items-center justify-center text-center mb-6 ${gpxFile
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer'
              }`}
          >
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
            </div>

            {gpxFile ? (
              <>
                <h3 className="font-bold text-lg mb-1 text-emerald-400">Bestand toegevoegd!</h3>
                <p className="text-emerald-400/80 text-sm max-w-sm">{gpxFile.name}</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-1 text-foreground">Upload GPX-bestand</h3>
                <p className="text-muted-foreground text-sm max-w-sm">Sleep je GPX-bestand hierheen om de route op de kaart te tonen.</p>
              </>
            )}

            {/* Hidden file input for click-to-upload could go here */}
          </motion.div>
        </div>
      </div>

      <div className="sticky bottom-24 md:bottom-8 z-40 mt-8 mb-24 md:mb-8 bg-card/90 backdrop-blur-xl border border-border/10 p-4 rounded-3xl flex justify-end gap-4 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isSubmitting ? (id ? 'Updaten...' : 'Opslaan...') : (id ? 'Route Updaten' : 'Route Opslaan')}
        </button>
      </div>
    </form>
  )
}
