type RequestOptions = {
  body?: unknown;
  headers?: HeadersInit;
};

export class ApiHttpClient {
  private readonly cookieJar = new Map<string, string>();

  constructor(
    private readonly baseUrl: string,
    private readonly origin: string,
  ) {}

  async get(pathname: string, options: Omit<RequestOptions, "body"> = {}) {
    return this.request("GET", pathname, options);
  }

  async getJson<T>(pathname: string, options: Omit<RequestOptions, "body"> = {}) {
    const response = await this.get(pathname, options);

    return {
      json: (await response.json()) as T,
      response,
    };
  }

  async post(pathname: string, options: RequestOptions = {}) {
    return this.request("POST", pathname, options);
  }

  async postJson<T>(pathname: string, options: RequestOptions = {}) {
    const response = await this.post(pathname, options);

    return {
      json: (await response.json()) as T,
      response,
    };
  }

  private async request(method: string, pathname: string, options: RequestOptions) {
    const url = new URL(pathname, this.baseUrl);
    const headers = new Headers(options.headers);

    headers.set("accept", "application/json");
    headers.set("origin", this.origin);
    headers.set("sec-fetch-site", "same-site");

    const cookieHeader = this.getCookieHeader();

    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    let body: BodyInit | undefined;

    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
      body,
      headers,
      method,
    });

    this.captureSetCookieHeaders(response.headers);

    return response;
  }

  private captureSetCookieHeaders(headers: Headers) {
    for (const setCookie of headers.getSetCookie()) {
      const [cookiePair, ...attributes] = setCookie.split(";").map((part) => part.trim());
      const [name, ...valueParts] = cookiePair.split("=");
      const value = valueParts.join("=");
      const isExpired = value === "" || attributes.some((attribute) => attribute.toLowerCase() === "max-age=0");

      if (isExpired) {
        this.cookieJar.delete(name);
        continue;
      }

      this.cookieJar.set(name, `${name}=${value}`);
    }
  }

  private getCookieHeader() {
    return Array.from(this.cookieJar.values()).join("; ");
  }
}

export function createHttpClient(input: { baseUrl: string; origin?: string }) {
  return new ApiHttpClient(input.baseUrl, input.origin ?? input.baseUrl);
}
