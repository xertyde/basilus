'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { createClient } from '@supabase/supabase-js';

// Configuration du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UploadPage() {
  const [username, setUsername] = useState('');
  const [contentName, setContentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [contentType, setContentType] = useState<'file' | 'text'>('file');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (contentType === 'text') {
        // Insertion du texte dans la table 'uploads'
        const { error: insertError } = await supabase
          .from('uploads')
          .insert([
            {
              client_name: username,
              content_name: contentName,
              content: textContent
            }
          ]);

        if (insertError) throw insertError;
      } else if (file) {
        // Upload du fichier dans le bucket 'uploads'
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Insertion des métadonnées du fichier dans la table 'uploads'
        const { error: insertError } = await supabase
          .from('uploads')
          .insert([
            {
              client_name: username,
              content_name: contentName,
              content: filePath // Stockage du chemin du fichier
            }
          ]);

        if (insertError) throw insertError;
      }

      setSuccess(true);
      // Réinitialisation du formulaire
      setUsername('');
      setContentName('');
      setFile(null);
      setTextContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Télécharger du contenu</h1>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          Contenu téléchargé avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contentName">Nom du contenu</label>
          <input
            type="text"
            id="contentName"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
            required
            className={styles.input}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Type de contenu</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="file"
                checked={contentType === 'file'}
                onChange={() => setContentType('file')}
                disabled={isLoading}
              />
              Fichier (Image/Vidéo)
            </label>
            <label>
              <input
                type="radio"
                value="text"
                checked={contentType === 'text'}
                onChange={() => setContentType('text')}
                disabled={isLoading}
              />
              Texte
            </label>
          </div>
        </div>

        {contentType === 'file' ? (
          <div className={styles.formGroup}>
            <label htmlFor="file">Sélectionner un fichier</label>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className={styles.fileInput}
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label htmlFor="textContent">Contenu textuel</label>
            <textarea
              id="textContent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required
              className={styles.textarea}
              rows={5}
              disabled={isLoading}
            />
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Téléchargement...' : 'Télécharger'}
        </button>
      </form>
    </div>
  );
} 