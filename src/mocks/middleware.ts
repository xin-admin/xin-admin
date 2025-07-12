// mocks/middleware.js
import {HttpResponse, type HttpResponseResolver} from 'msw'

// A higher-order response resolver that validates
// the request authorization header before proceeding
// with the actual response resolver.
export function withAuth(resolver:  HttpResponseResolver): HttpResponseResolver {
  return (input) => {
    const { request } = input

    if (!request.headers.get('Authorization')) {
      return new HttpResponse(null, { status: 401 })
    }

    return resolver(input)
  }
}