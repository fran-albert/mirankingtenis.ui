import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Camera, Upload, Check, X, Crop as CropIcon, Undo, AlertCircle, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Image from "next/image";
import { toast } from "sonner";

interface CropWithAspect extends Crop {
  aspect?: number;
}

interface ImagePickerProps {
  onImageSelect: (image: string) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropWithAspect>({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    unit: "%",
    aspect: 1,
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [usingWebcam, setUsingWebcam] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    dimensions: { width: number; height: number };
  } | null>(null);

  // Cámara nativa
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Imagen a recortar
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Constantes de configuración
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const COMPRESSION_QUALITY = 0.8;

  // Función para comprimir imagen
  const compressImage = useCallback(async (
    canvas: HTMLCanvasElement, 
    originalSize: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      let quality = COMPRESSION_QUALITY;
      let compressedDataUrl = '';
      
      const tryCompress = () => {
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        
        // Si el archivo comprimido sigue siendo muy grande, reducir calidad
        if (compressedSize > MAX_FILE_SIZE && quality > 0.3) {
          quality -= 0.1;
          tryCompress();
        } else {
          setImageInfo({
            originalSize,
            compressedSize,
            dimensions: { width: canvas.width, height: canvas.height }
          });
          resolve(compressedDataUrl);
        }
      };
      
      tryCompress();
    });
  }, [MAX_FILE_SIZE]);

  // Función para validar archivo
  const validateFile = useCallback((file: File): boolean => {
    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Formato no soportado. Use JPG, PNG o WebP.');
      return false;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`El archivo es muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return false;
    }

    return true;
  }, [ALLOWED_TYPES, MAX_FILE_SIZE]);

  // Función para obtener dimensiones de imagen
  const getImageDimensions = useCallback((src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = src;
    });
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accediendo a la cámara:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Arrancar/parar cámara cuando toggles usando cámara
  useEffect(() => {
    if (usingWebcam) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [usingWebcam, startCamera, stopCamera]);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validar archivo
      if (!validateFile(file)) {
        e.target.value = '';
        return;
      }
      
      setIsProcessing(true);
      
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageSrc = reader.result as string;
          const dimensions = await getImageDimensions(imageSrc);
          
          // Mostrar información del archivo
          toast.success(`Imagen cargada: ${dimensions.width}x${dimensions.height}px, ${(file.size / 1024 / 1024).toFixed(2)}MB`);
          
          setSelectedImage(imageSrc);
          setIsPreviewMode(false);
          setCroppedImage(null);
          setUsingWebcam(false);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error al cargar imagen:', error);
        toast.error('Error al cargar la imagen');
        setIsProcessing(false);
      }
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const imageSrc = canvas.toDataURL("image/jpeg");
    
    // Primero cerrar la cámara, luego establecer la imagen
    setUsingWebcam(false);
    // Pequeño delay para asegurar que la cámara se cierre antes de mostrar el recorte
    setTimeout(() => {
      setSelectedImage(imageSrc);
      setIsPreviewMode(false);
      setCroppedImage(null);
    }, 100);
  }, []);

  const onImageLoaded = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    imgRef.current = event.currentTarget;
  };

  const generateCroppedImage = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;
    
    setIsProcessing(true);

    // Medidas en pantalla
    const displayW = imgRef.current.width;
    const displayH = imgRef.current.height;

    // Convertir crop % → px si hace falta (ReactCrop puede usar %)
    const cropXpx =
      crop.unit === "%" ? ((crop.x ?? 0) * displayW) / 100 : crop.x ?? 0;
    const cropYpx =
      crop.unit === "%" ? ((crop.y ?? 0) * displayH) / 100 : crop.y ?? 0;
    const cropWpx =
      crop.unit === "%"
        ? ((crop.width as number) * displayW) / 100
        : (crop.width as number);
    const cropHpx =
      crop.unit === "%"
        ? ((crop.height as number) * displayH) / 100
        : (crop.height as number);

    // Escala a resolución real
    const scaleX = imgRef.current.naturalWidth / displayW;
    const scaleY = imgRef.current.naturalHeight / displayH;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropWpx);
    canvas.height = Math.round(cropHpx);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      cropXpx * scaleX,
      cropYpx * scaleY,
      cropWpx * scaleX,
      cropHpx * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    try {
      // Calcular tamaño original estimado
      const originalSize = Math.round((selectedImage?.length || 0) * 3 / 4);
      
      // Comprimir imagen
      const compressedImage = await compressImage(canvas, originalSize);
      
      setCroppedImage(compressedImage);
      setIsPreviewMode(true);
      
      // Mostrar información de compresión
      if (imageInfo) {
        const compressionRatio = ((imageInfo.originalSize - imageInfo.compressedSize) / imageInfo.originalSize * 100).toFixed(1);
        toast.success(`Imagen optimizada: ${compressionRatio}% de reducción`);
      }
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast.error('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden">
      <div className="p-5 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="button"
            onClick={() => {
              // Limpiar estados antes de abrir la cámara
              setSelectedImage(null);
              setCroppedImage(null);
              setIsPreviewMode(false);
              setUsingWebcam(true);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 transform ${
              usingWebcam
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:scale-105 hover:shadow-lg"
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>Usar cámara</span>
          </Button>

          <Label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-5 h-5" />
            <span>{isProcessing ? 'Procesando...' : 'Subir imagen'}</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onSelectFile}
              className="hidden"
              disabled={isProcessing}
            />
          </Label>
        </div>

        {/* Información de limitaciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Requisitos:</p>
              <ul className="text-xs space-y-0.5">
                <li>• Formatos: JPG, PNG, WebP</li>
                <li>• Tamaño máximo: 2MB</li>
                <li>• Se optimizará automáticamente</li>
              </ul>
            </div>
          </div>
        </div>

        {usingWebcam && !selectedImage && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border border-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full"
                muted
              />
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                onClick={capture}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-primary-foreground transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Capturar</span>
              </Button>
              <Button
                type="button"
                onClick={() => setUsingWebcam(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancelar</span>
              </Button>
            </div>
          </div>
        )}

        {!isPreviewMode && !usingWebcam && selectedImage && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border border-gray-200">
              <ReactCrop
                crop={crop}
                onChange={(newCrop: CropWithAspect) => setCrop(newCrop)}
                className="max-h-[400px] overflow-auto"
              >
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  onLoad={onImageLoaded}
                  alt="Imagen para recortar"
                  width={400}
                  height={400}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={generateCroppedImage}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CropIcon className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Procesando...' : 'Confirmar recorte'}</span>
              </Button>
            </div>
          </div>
        )}

        {isPreviewMode && croppedImage && (
          <div className="space-y-4">
            <div className="p-4 rounded-md border border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
              <div className="flex justify-center">
                <Image
                  src={croppedImage || "/placeholder.svg"}
                  alt="Imagen recortada"
                  className="max-w-full h-auto rounded-md shadow-sm"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                onClick={() => onImageSelect(croppedImage)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                <Check className="w-5 h-5" />
                <span>Usar esta imagen</span>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsPreviewMode(false);
                  setCroppedImage(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                <Undo className="w-5 h-5" />
                <span>Volver a recortar</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
