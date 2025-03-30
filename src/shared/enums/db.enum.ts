export enum DatabaseCollectionNames {
  USER = 'users',
  TOKEN = 'tokens',
  PROFILE = 'profiles',
  STORE = 'stores',
  PRODUCT = 'products',
  ABOUT = 'abouts',
  LAYAWAY = 'layaways',
}

export enum DatabaseModelNames {
  USER = 'User',
  TOKEN = 'Token',
  PROFILE = 'Profile',
  STORE = 'Store',
  PRODUCT = 'Product',
  ABOUT = 'About',
  LAYAWAY = 'Layaway',
}

export enum TokenTypes {
  registration = 'registration',
  login = 'login',
  forgotPassword = 'forgotPassword',
}

export enum UserTypes {
  user = 'user',
  vendor = 'vendor',
  admin = 'admin',
  buyer = 'buyer',
}
