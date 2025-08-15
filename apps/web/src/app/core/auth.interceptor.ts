import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const withAuth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, withCredentials: true })
    : req.clone({ withCredentials: true });

  return next(withAuth);
};
