type RouteUrls = {
  base: string;
  [key: string]: string;
};

class FRoute {
  private item: RouteUrls;

  constructor(initBaseRoute: RouteUrls, otherRoutes?: { key: string; slug: string; parentKey?: keyof RouteUrls; }[]) {
    this.item = initBaseRoute;

    if (otherRoutes && otherRoutes?.length > 0) {
      otherRoutes.forEach(route => {
        this.setNewRoute({ key: route.key, slug: route.slug, parentKey: route.parentKey });
      });
    }
  }

  getBase() {
    return this.item.base;
  }

  getItem(key: string) {
    return this.item[key];
  }

  private setNewRoute({ key, slug, parentKey }: { key: string; slug: string; parentKey?: keyof RouteUrls; }) {
    if (parentKey && this.item[parentKey]) {
      this.item[key] = `${this.item[parentKey]}/${slug}`;
      return;
    }

    this.item[key] = `./${slug}`;
  }
}

FRoute.prototype.valueOf = function () {
  return this.getBase();
};

export const CreatorAdminRoutes = new FRoute({ base: 'creator-admin' }, [
  { key: 'event', slug: 'event', parentKey: 'base' },
  { key: 'user-account', slug: 'user-account', parentKey: 'base' }
]);

export const PublicRoutes = new FRoute({ base: 'pe' }, [
  { key: 'unsuscribe', slug: 'unsuscribe', parentKey: 'base' }
]);

export const WebsiteRoutes = new FRoute({ base: '' }, [
  { key: 'waiting_for_the_email', slug: 'waiting-for-the-email', parentKey: 'base' }
]);
