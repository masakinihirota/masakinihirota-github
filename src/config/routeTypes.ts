export type RouteMeta = {
  label: string;
  order?: number;
  visibleInMenu?: boolean;
  authRequired?: boolean;
  group?: 'main'|'more'|'footer'|'feature';
  roles?: string[];
  i18nKey?: string;
  featureFlag?: string;
  description?: string;
}

export type RouteManifestItem = RouteMeta & { path: string; source?: string };

export type RouteManifest = RouteManifestItem[];
