"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

interface Artwork {
  id: number;
  userId: string;
  title: string;
  description: string;
  isForSale: boolean;
  price: number | null;
  sold: boolean;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  artworks: Artwork[];
  question: string | null;
}

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
}

type TabKey = "artworks" | "posts" | "forSale";
type ErrorType =
  | "NETWORK_ERROR"
  | "PARSING_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "GENERIC_ERROR";

interface ApiError {
  type: ErrorType;
  message: string;
  timestamp: number;
}

interface TabConfiguration {
  readonly key: TabKey;
  readonly label: string;
  readonly icon: React.ComponentType<{ size?: number; className?: string }>;
  readonly endpoint: string;
  readonly params: Record<string, boolean | string | number>;
  readonly ariaLabel: string;
  readonly description: string;
}

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

interface DataState {
  data: Record<TabKey, Artwork[] | Post[]>;
  loading: Record<TabKey, boolean>;
  errors: Record<TabKey, ApiError | null>;
  pages: Record<TabKey, number>;
  hasMore: Record<TabKey, boolean>;
  cache: Record<string, CacheEntry>;
  initialized: Record<TabKey, boolean>;
}

type ActionType =
  | "SET_LOADING"
  | "SET_DATA"
  | "SET_ERROR"
  | "SET_PAGINATION"
  | "CACHE_DATA"
  | "CLEAR_ERROR"
  | "SET_INITIALIZED";

interface DataAction {
  type: ActionType;
  tabKey?: TabKey;
  data?: unknown;
  error?: ApiError | null;
  isLoading?: boolean;
  page?: number;
  hasMore?: boolean;
  reset?: boolean;
  cacheKey?: string;
  initialized?: boolean;
}

import {
  AlertCircle as AlertIcon,
  Calendar,
  Euro,
  Grid,
  Info,
  MessageCircle,
  RefreshCw,
  Tag,
  User,
} from "lucide-react";

const TABS_CONFIGURATION: Record<TabKey, TabConfiguration> = {
  artworks: {
    key: "artworks",
    label: "Œuvres",
    icon: Grid,
    endpoint: "/api/artworks",
    params: { isForSale: false },
    ariaLabel: "Galerie des œuvres artistiques",
    description: "Collection complète des créations artistiques",
  },
  posts: {
    key: "posts",
    label: "Posts",
    icon: MessageCircle,
    endpoint: "/api/posts",
    params: {},
    ariaLabel: "Publications et actualités",
    description: "Contenus éditoriaux et actualités récentes",
  },
  forSale: {
    key: "forSale",
    label: "Œuvres à vendre",
    icon: Euro,
    endpoint: "/api/artworks",
    params: { isForSale: true },
    ariaLabel: "Œuvres disponibles à la vente",
    description: "Collection des œuvres commercialisables",
  },
} as const;

const ERROR_TYPES: Record<string, ErrorType> = {
  NETWORK: "NETWORK_ERROR",
  PARSING: "PARSING_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  GENERIC: "GENERIC_ERROR",
} as const;

const ACTION_TYPES: Record<string, ActionType> = {
  SET_LOADING: "SET_LOADING",
  SET_DATA: "SET_DATA",
  SET_ERROR: "SET_ERROR",
  SET_PAGINATION: "SET_PAGINATION",
  CACHE_DATA: "CACHE_DATA",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_INITIALIZED: "SET_INITIALIZED",
} as const;

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.tabKey!]: action.isLoading!,
        },
      };

    case ACTION_TYPES.SET_DATA:
      let dataToSet;
      if (action.tabKey === "posts") {
        dataToSet = Array.isArray(action.data)
          ? (action.data as Post[]).filter((post) => post.question === null)
          : [];
      } else {
        dataToSet = action.data as Artwork[] | Post[];
      }

      return {
        ...state,
        data: {
          ...state.data,
          [action.tabKey!]: action.reset
            ? dataToSet
            : [...(state.data[action.tabKey!] || []), ...dataToSet],
        },
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.tabKey!]: action.error!,
        },
        loading: {
          ...state.loading,
          [action.tabKey!]: false,
        },
      };

    case ACTION_TYPES.SET_PAGINATION:
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.tabKey!]: action.page!,
        },
        hasMore: {
          ...state.hasMore,
          [action.tabKey!]: action.hasMore!,
        },
      };

    case ACTION_TYPES.CACHE_DATA:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.cacheKey!]: {
            data: action.data!,
            timestamp: Date.now(),
          },
        },
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.tabKey!]: null,
        },
      };

    case ACTION_TYPES.SET_INITIALIZED:
      return {
        ...state,
        initialized: {
          ...state.initialized,
          [action.tabKey!]: action.initialized!,
        },
      };

    default:
      return state;
  }
};

const createInitialState = (): DataState => ({
  data: {} as Record<TabKey, Artwork[] | Post[]>,
  loading: {} as Record<TabKey, boolean>,
  errors: {} as Record<TabKey, ApiError | null>,
  pages: {} as Record<TabKey, number>,
  hasMore: {} as Record<TabKey, boolean>,
  cache: {} as Record<string, CacheEntry>,
  initialized: {} as Record<TabKey, boolean>,
});

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ErrorState: React.FC<{
  error: ApiError | null;
  onRetry: () => void;
  tabLabel: string;
}> = React.memo(({ error, onRetry, tabLabel }) => {
  const getErrorMessage = useCallback((errorType: ErrorType): string => {
    const messages: Record<ErrorType, string> = {
      NETWORK_ERROR: "Erreur de connexion réseau",
      PARSING_ERROR: "Erreur de traitement des données",
      UNAUTHORIZED: "Accès non autorisé",
      NOT_FOUND: "Ressource introuvable",
      GENERIC_ERROR: "Une erreur inattendue s'est produite",
    };
    return messages[errorType] || messages[ERROR_TYPES.GENERIC];
  }, []);

  if (!error) return null;

  return (
    <Alert className="mx-4 my-8" role="alert" aria-live="polite">
      <AlertIcon className="h-4 w-4" aria-hidden="true" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium mb-1">
            Erreur lors du chargement de {tabLabel}
          </p>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(error.type)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          aria-label={`Réessayer le chargement de ${tabLabel}`}
        >
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Réessayer
        </Button>
      </AlertDescription>
    </Alert>
  );
});

ErrorState.displayName = "ErrorState";

const ContentSkeleton: React.FC<{ type?: TabKey }> = React.memo(
  ({ type = "artworks" }) => {
    const skeletonCount = type === "posts" ? 6 : 12;
    const gridClass =
      type === "posts"
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

    return (
      <div
        className={`grid gap-4 ${gridClass}`}
        aria-label="Chargement du contenu en cours"
        role="status"
      >
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton
                className={
                  type === "posts" ? "h-32 w-full" : "aspect-square w-full"
                }
                aria-hidden="true"
              />
              {type === "posts" && (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" aria-hidden="true" />
                  <Skeleton className="h-4 w-1/2" aria-hidden="true" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);

ContentSkeleton.displayName = "ContentSkeleton";

const ArtworkCard: React.FC<{
  artwork: Artwork;
  onInteraction: (artwork: Artwork) => void;
}> = React.memo(({ artwork, onInteraction }) => {
  const handleClick = useCallback(() => {
    onInteraction(artwork);
  }, [artwork, onInteraction]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const ariaLabel = useMemo(() => {
    let label = `Œuvre: ${artwork.title}`;
    if (artwork.description) {
      label += `. ${artwork.description}`;
    }
    if (artwork.isForSale && artwork.price) {
      label += `. Prix: ${artwork.price}€`;
    }
    return label;
  }, [artwork]);

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary"
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-0 relative group">
        <div className="aspect-square overflow-hidden">
          <img
            src={artwork.thumbnail}
            alt={`Aperçu de l'œuvre ${artwork.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-artwork.jpg";
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {artwork.title}
            </h3>
            {artwork.description && (
              <p className="text-xs opacity-90 mb-2 line-clamp-2">
                {artwork.description}
              </p>
            )}
            {artwork.isForSale && artwork.price && (
              <span className="inline-block text-xs bg-green-500 px-2 py-1 rounded font-medium">
                {artwork.price}€
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ArtworkCard.displayName = "ArtworkCard";

// ==================== COMPOSANT POST CARD ====================

const PostCard: React.FC<{
  post: Post;
  onInteraction: (post: Post) => void;
}> = React.memo(({ post, onInteraction }) => {
  const formatDate = useMemo(() => {
    try {
      return new Date(post.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  }, [post.createdAt]);

  const handleClick = useCallback(() => {
    onInteraction(post);
  }, [post, onInteraction]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const ariaLabel = useMemo(() => {
    const contentPreview = post.content?.substring(0, 100) || "";
    return `Publication du ${formatDate}: ${contentPreview}${contentPreview.length >= 100 ? "..." : ""}`;
  }, [post.content, formatDate]);

  return (
    <Card
      className="transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary cursor-pointer"
      tabIndex={0}
      role="article"
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground line-clamp-4">
            {post.content || "Contenu non disponible"}
          </p>

          {post.artworks?.length > 0 && (
            <div
              className="grid grid-cols-2 gap-2"
              aria-label={`${post.artworks.length} œuvre(s) associée(s)`}
            >
              {post.artworks.slice(0, 4).map((artwork) => (
                <div
                  key={artwork.id}
                  className="aspect-square bg-muted rounded overflow-hidden"
                >
                  <img
                    src={artwork.thumbnail}
                    alt={`Œuvre associée: ${artwork.title || "Sans titre"}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-artwork.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end text-xs text-muted-foreground">
            <time dateTime={post.createdAt} className="font-medium">
              {formatDate}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArtworkDialog: React.FC<{
  artwork: Artwork;
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
}> = React.memo(({ artwork, artist, isOpen, onClose }) => {
  const formatDate = useMemo(() => {
    try {
      return new Date(artwork.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  }, [artwork.createdAt]);

  const formatPrice = useMemo(() => {
    if (!artwork.price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(artwork.price);
  }, [artwork.price]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-3xl w-full max-h-[90vh] p-0 gap-0 overflow-hidden rounded-lg"
        aria-describedby="artwork-dialog-description"
      >
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
            {artwork.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 h-full">
          <div
            id="artwork-dialog-description"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6"
          >
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={artwork.thumbnail}
                  alt={`Œuvre complète: ${artwork.title}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-artwork.jpg";
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate}
                </Badge>

                {artwork.isForSale && (
                  <Badge
                    variant="default"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Tag className="h-3 w-3" />À vendre
                  </Badge>
                )}

                {artwork.sold && (
                  <Badge variant="destructive" className="text-xs">
                    Vendu
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Artiste
                </h3>

                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage
                      src={artist.avatar}
                      alt={`Photo de profil de ${artist.name}`}
                    />
                    <AvatarFallback className="text-sm">
                      {artist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1 min-w-0">
                    <h4 className="font-medium text-base">{artist.name}</h4>

                    {artist.location && (
                      <p className="text-xs text-muted-foreground">
                        📍 {artist.location}
                      </p>
                    )}

                    {artist.joinedDate && (
                      <p className="text-xs text-muted-foreground">
                        Membre depuis{" "}
                        {new Date(artist.joinedDate).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold">
                  Description de l&apos;œuvre
                </h3>

                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-foreground leading-relaxed">
                    {artwork.description ||
                      "Aucune description fournie pour cette œuvre."}
                  </p>
                </div>
              </div>

              {artwork.isForSale && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Information de vente
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Prix:</span>
                      <span className="text-base font-bold text-primary">
                        {formatPrice || "Prix sur demande"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Statut:</span>
                      <Badge
                        variant={artwork.sold ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {artwork.sold ? "Vendu" : "Disponible"}
                      </Badge>
                    </div>
                  </div>

                  {!artwork.sold && (
                    <Button className="w-full mt-3" size="sm">
                      Contacter l&apos;artiste
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

ArtworkDialog.displayName = "ArtworkDialog";

const useProfileData = (
  userId: string,
  options: { limit?: number; cacheTimeout?: number } = {}
) => {
  const { limit = 12, cacheTimeout = 300000 } = options;
  const [state, dispatch] = useReducer(
    dataReducer,
    undefined,
    createInitialState
  );

  const configRef = useRef({ limit, cacheTimeout, userId });

  useEffect(() => {
    configRef.current = { limit, cacheTimeout, userId };
  });

  const createCacheKey = useCallback((tabKey: TabKey, page: number): string => {
    const config = TABS_CONFIGURATION[tabKey];
    return `${tabKey}-${page}-${JSON.stringify(config.params)}`;
  }, []);

  const fetchData = useCallback(
    async (tabKey: TabKey, page = 1, reset = false): Promise<void> => {
      const config = TABS_CONFIGURATION[tabKey];
      if (!config) {
        console.error(`Configuration non trouvée pour l'onglet: ${tabKey}`);
        return;
      }

      const cacheKey = createCacheKey(tabKey, page);
      const currentConfig = configRef.current;

      const cachedEntry = state.cache[cacheKey];
      const isCacheValid =
        cachedEntry &&
        Date.now() - cachedEntry.timestamp < currentConfig.cacheTimeout;

      if (isCacheValid && !reset) {
        const cachedData = cachedEntry.data as Artwork[] | Post[];
        dispatch({
          type: ACTION_TYPES.SET_DATA,
          tabKey,
          data: cachedData,
          reset,
        });
        dispatch({
          type: ACTION_TYPES.SET_PAGINATION,
          tabKey,
          page,
          hasMore:
            Array.isArray(cachedData) &&
            cachedData.length === currentConfig.limit,
        });
        dispatch({
          type: ACTION_TYPES.SET_INITIALIZED,
          tabKey,
          initialized: true,
        });
        return;
      }

      dispatch({ type: ACTION_TYPES.CLEAR_ERROR, tabKey });
      dispatch({ type: ACTION_TYPES.SET_LOADING, tabKey, isLoading: true });

      try {
        const params = new URLSearchParams({
          userId: currentConfig.userId,
          limit: currentConfig.limit.toString(),
          page: page.toString(),
          ...Object.fromEntries(
            Object.entries(config.params).map(([key, value]) => [
              key,
              value.toString(),
            ])
          ),
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${config.endpoint}?${params}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const newData = await response.json();

        if (!Array.isArray(newData)) {
          throw new Error("Format de données invalide");
        }

        // Mise à jour atomique de l'état
        dispatch({ type: ACTION_TYPES.CACHE_DATA, cacheKey, data: newData });
        dispatch({ type: ACTION_TYPES.SET_DATA, tabKey, data: newData, reset });
        dispatch({
          type: ACTION_TYPES.SET_PAGINATION,
          tabKey,
          page,
          hasMore: newData.length === currentConfig.limit,
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, tabKey, isLoading: false });
        dispatch({
          type: ACTION_TYPES.SET_INITIALIZED,
          tabKey,
          initialized: true,
        });
      } catch (error) {
        console.error(
          `Erreur lors du chargement des données pour ${tabKey}:`,
          error
        );

        let errorType: ErrorType = ERROR_TYPES.GENERIC;
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorType = ERROR_TYPES.NETWORK;
          } else if (errorMessage.includes("Failed to fetch")) {
            errorType = ERROR_TYPES.NETWORK;
          } else if (errorMessage.includes("404")) {
            errorType = ERROR_TYPES.NOT_FOUND;
          } else if (
            errorMessage.includes("401") ||
            errorMessage.includes("403")
          ) {
            errorType = ERROR_TYPES.UNAUTHORIZED;
          } else if (errorMessage.includes("JSON")) {
            errorType = ERROR_TYPES.PARSING;
          }
        }

        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          tabKey,
          error: {
            type: errorType,
            message: errorMessage,
            timestamp: Date.now(),
          },
        });
      }
    },
    [createCacheKey]
  );

  // Initialisation contrôlée - une seule fois par onglet
  const initializeTab = useCallback(
    (tabKey: TabKey): void => {
      if (!state.initialized[tabKey] && !state.loading[tabKey]) {
        fetchData(tabKey, 1, true);
      }
    },
    [state.initialized, state.loading, fetchData]
  );

  // Chargement incrémental
  const loadMore = useCallback(
    (tabKey: TabKey): void => {
      const currentPage = state.pages[tabKey] || 1;
      fetchData(tabKey, currentPage + 1, false);
    },
    [state.pages, fetchData]
  );

  // Rechargement
  const retryLoad = useCallback(
    (tabKey: TabKey): void => {
      dispatch({
        type: ACTION_TYPES.SET_INITIALIZED,
        tabKey,
        initialized: false,
      });
      fetchData(tabKey, 1, true);
    },
    [fetchData]
  );

  return {
    data: state.data,
    loading: state.loading,
    errors: state.errors,
    hasMore: state.hasMore,
    initialized: state.initialized,
    initializeTab,
    loadMore,
    retryLoad,
  };
};

interface ProfileTabsProps {
  userId?: string;
  className?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userId = "7v38ozcfeyV1VO6NrO6UCsciTzC2kT6Q",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("artworks");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { data, loading, errors, hasMore, initializeTab, loadMore, retryLoad } =
    useProfileData(userId);

  // Données de l'onglet actuel
  const currentTabData = data[activeTab] || [];
  const isLoading = loading[activeTab] || false;
  const hasError = errors[activeTab];
  const canLoadMore = hasMore[activeTab] || false;

  // Informations d'artiste factices
  const mockArtist: Artist = useMemo(
    () => ({
      id: userId,
      name: "Marie Dubois",
      avatar: "/api/placeholder/avatar.jpg",
      bio: "Artiste peintre contemporaine spécialisée dans l'art abstrait et les techniques mixtes. Diplômée des Beaux-Arts de Paris.",
      location: "Paris, France",
      joinedDate: "2020-03-15",
    }),
    [userId]
  );

  // Initialisation lors du changement d'onglet
  useEffect(() => {
    if (activeTab && userId) {
      initializeTab(activeTab);
    }
  }, [activeTab, userId, initializeTab]);

  // Gestionnaires d'événements
  const handleArtworkInteraction = useCallback((artwork: Artwork): void => {
    setSelectedArtwork(artwork);
    setIsDialogOpen(true);
  }, []);

  const handlePostInteraction = useCallback((post: Post): void => {
    console.log("Interaction avec le post:", post);
  }, []);

  const handleTabChange = useCallback((tabKey: string): void => {
    if (tabKey in TABS_CONFIGURATION) {
      setActiveTab(tabKey as TabKey);
    }
  }, []);

  const handleLoadMore = useCallback((): void => {
    if (canLoadMore && !isLoading) {
      loadMore(activeTab);
    }
  }, [canLoadMore, isLoading, loadMore, activeTab]);

  const handleDialogClose = useCallback((): void => {
    setIsDialogOpen(false);
    setSelectedArtwork(null);
  }, []);

  // Rendu du contenu des onglets
  const renderTabContent = useCallback(
    (tabKey: TabKey) => {
      const tabConfig = TABS_CONFIGURATION[tabKey];
      const tabData = data[tabKey] || [];
      const tabLoading = loading[tabKey] || false;
      const tabError = errors[tabKey];

      if (tabError) {
        return (
          <ErrorState
            error={tabError}
            onRetry={() => retryLoad(tabKey)}
            tabLabel={tabConfig.label}
          />
        );
      }

      if (tabLoading && tabData.length === 0) {
        return <ContentSkeleton type={tabKey} />;
      }

      if (tabData.length === 0) {
        return (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="text-muted-foreground mb-4">
              <Grid size={48} className="mx-auto" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Aucun contenu disponible
            </h3>
            <p className="text-muted-foreground">{tabConfig.description}</p>
          </div>
        );
      }

      const isPostTab = tabKey === "posts";
      const gridClass = isPostTab
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

      return (
        <>
          {isPostTab && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Cette section affiche uniquement les publications standard. Les
                questions à la communauté sont affichées dans une section
                dédiée.
              </AlertDescription>
            </Alert>
          )}
          <div
            className={`grid gap-4 ${gridClass}`}
            role="grid"
            aria-label={`Grille de ${tabConfig.label.toLowerCase()}`}
          >
            {tabData.map((item) => (
              <div key={item.id} role="gridcell">
                {isPostTab ? (
                  <PostCard
                    post={item as Post}
                    onInteraction={handlePostInteraction}
                  />
                ) : (
                  <ArtworkCard
                    artwork={item as Artwork}
                    onInteraction={handleArtworkInteraction}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      );
    },
    [
      data,
      loading,
      errors,
      retryLoad,
      handleArtworkInteraction,
      handlePostInteraction,
    ]
  );

  if (!userId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Identifiant utilisateur requis pour afficher le contenu.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full mx-auto ${className}`}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList
          className="grid w-full grid-cols-3 mb-6"
          aria-label="Navigation des sections de profil"
        >
          {Object.values(TABS_CONFIGURATION).map((config) => {
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={config.key}
                value={config.key}
                className="flex items-center justify-center space-x-2 text-sm font-medium"
                aria-label={config.ariaLabel}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(TABS_CONFIGURATION).map((tabKey) => (
          <TabsContent
            key={tabKey}
            value={tabKey}
            className="mt-0 min-h-96"
            role="tabpanel"
            aria-labelledby={`tab-${tabKey}`}
          >
            {renderTabContent(tabKey as TabKey)}

            {canLoadMore &&
              !isLoading &&
              !hasError &&
              currentTabData.length > 0 && (
                <div className="flex justify-center mt-8 mb-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    aria-label="Charger plus de contenu"
                  >
                    Voir plus
                  </Button>
                </div>
              )}

            {isLoading && currentTabData.length > 0 && (
              <div
                className="flex justify-center mt-4"
                role="status"
                aria-live="polite"
                aria-label="Chargement de contenu supplémentaire"
              >
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
                  aria-hidden="true"
                ></div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialogue détail œuvre */}
      {selectedArtwork && (
        <ArtworkDialog
          artwork={selectedArtwork}
          artist={mockArtist}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
};

ProfileTabs.displayName = "ProfileTabs";

export default ProfileTabs;
