'use client';

import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { validateMimeType, validateFileSize, sanitizeFileName, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/security';
import { Upload, FileText, Image, Video, X, CheckCircle, AlertCircle, File, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Vérifier si le type de fichier est autorisé
      const isValidType = validateMimeType(droppedFile.type, ALLOWED_MIME_TYPES);
      
      if (isValidType) {
        setFile(droppedFile);
        // Mettre à jour l'input file pour la soumission
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(droppedFile);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        toast({
          title: "Type de fichier non supporté",
          description: "Format de fichier non autorisé. Veuillez consulter la liste des formats acceptés.",
          variant: "destructive"
        });
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
        // Validation de sécurité du fichier
        if (!validateMimeType(file.type, ALLOWED_MIME_TYPES)) {
          throw new Error(`Type de fichier non autorisé: ${file.type}`);
        }

        if (!validateFileSize(file.size, MAX_FILE_SIZE)) {
          throw new Error(`Fichier trop volumineux: ${file.size} bytes (max: ${MAX_FILE_SIZE})`);
        }

        // Upload du fichier dans le bucket 'uploads'
        const fileExt = file.name.split('.').pop();
        const sanitizedName = sanitizeFileName(file.name);
        const fileName = `${Math.random()}-${sanitizedName}`;
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

      // Afficher le toast de succès
      toast({
        title: "Contenu téléchargé !",
        description: "Votre contenu a été téléchargé avec succès.",
      });

      // Réinitialisation complète du formulaire
      setUsername('');
      setContentName('');
      setFile(null);
      setTextContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Afficher le toast d'erreur
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Télécharger du contenu</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Partagez facilement vos images, vidéos ou textes avec notre plateforme sécurisée. 
              Vos contenus sont automatiquement organisés et accessibles.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="animate-on-scroll">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Formulaire de téléchargement
                </CardTitle>
                <CardDescription>
                  Remplissez les informations ci-dessous pour télécharger votre contenu
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Votre nom ou pseudo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentName">Nom du contenu</Label>
                    <Input
                      id="contentName"
                      type="text"
                      value={contentName}
                      onChange={(e) => setContentName(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Titre descriptif de votre contenu"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Type de contenu</Label>
                    <RadioGroup
                      value={contentType}
                      onValueChange={(value) => setContentType(value as 'file' | 'text')}
                      disabled={isLoading}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="file" />
                        <Label htmlFor="file" className="flex items-center gap-2 cursor-pointer">
                          <Image className="h-4 w-4" />
                          Fichier (Image/Vidéo)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="text" />
                        <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" />
                          Texte
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {contentType === 'file' ? (
                    <div className="space-y-3">
                      <Label htmlFor="file">Sélectionner un fichier</Label>
                      <div className="relative">
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragOver 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-medium mb-2">
                                Glissez-déposez votre fichier ici
                              </p>
                              <p className="text-sm text-muted-foreground mb-4">
                                ou cliquez pour sélectionner un fichier
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                              >
                                Choisir un fichier
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <Input
                          ref={fileInputRef}
                          id="file"
                          type="file"
                          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.heic,.heif,.json,.csv,.xml"
                          onChange={handleFileChange}
                          required
                          disabled={isLoading}
                          className="hidden"
                        />
                        
                        {file && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  if (file.type.startsWith('image/')) {
                                    return <Image className="h-5 w-5 text-blue-500" />;
                                  } else if (file.type.startsWith('video/')) {
                                    return <Video className="h-5 w-5 text-purple-500" />;
                                  } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('word') || file.type.includes('excel') || file.type.includes('powerpoint')) {
                                    return <File className="h-5 w-5 text-red-500" />;
                                  } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar') || file.type.includes('gzip')) {
                                    return <Archive className="h-5 w-5 text-green-500" />;
                                  } else if (file.type.includes('text') || file.type.includes('json') || file.type.includes('xml') || file.type.includes('csv')) {
                                    return <FileText className="h-5 w-5 text-orange-500" />;
                                  } else {
                                    return <File className="h-5 w-5 text-gray-500" />;
                                  }
                                })()}
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearFile}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : Images (JPG, PNG, GIF, WEBP, HEIC, HEIF, SVG, BMP, TIFF), Vidéos (MP4, MOV, AVI, WEBM, OGG), Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX), Archives (ZIP, RAR, TAR, GZ), Autres (TXT, CSV, JSON, XML) - max 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="textContent">Contenu textuel</Label>
                      <Textarea
                        id="textContent"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Saisissez votre texte ici..."
                        rows={5}
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Télécharger
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Informations importantes</h2>
              <p className="text-lg text-muted-foreground">
                Tout ce que vous devez savoir sur le téléchargement de contenu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center animate-on-scroll">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Images & Vidéos</h3>
                  <p className="text-sm text-muted-foreground">
                    Support des formats : JPG, PNG, GIF, WEBP, HEIC, HEIF, SVG, BMP, TIFF, MP4, MOV, AVI, WEBM, OGG. 
                    Taille maximale : 10MB par fichier.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center animate-on-scroll delay-100">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Documents & Archives</h3>
                  <p className="text-sm text-muted-foreground">
                    Partagez vos PDF, documents Word/Excel/PowerPoint, archives ZIP/RAR, 
                    et fichiers texte (TXT, CSV, JSON, XML).
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center animate-on-scroll delay-200">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sécurisé & Organisé</h3>
                  <p className="text-sm text-muted-foreground">
                    Vos contenus sont stockés de manière sécurisée et 
                    automatiquement organisés par nom d'utilisateur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 