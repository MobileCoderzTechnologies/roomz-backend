export class ApiFeatures {
  query: any;
  queryString: any;
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {

  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.pageSize * 1 || 10;
    this.query = this.query.paginate(page, limit);
    return this;
  }

  sorting(defaultSort: string) {
    if (this.queryString.sort) {
      let sort = this.queryString.sort;
      if (sort.startsWith('-')) {
        sort = sort.replace('-', '');
        this.query = this.query.orderBy(sort, 'desc');
      } else {
        this.query = this.query.orderBy(sort, 'asc');
      }
    } else {
      this.query = this.query.orderBy(defaultSort, 'desc');
    }
    return this;

  }

  count() {
    this.query = this.query.getCount();
    return this;
  }

  searching(fields: String[]) {
    if (this.queryString.search) {
      const search = this.queryString.search;
      // fields.forEach(filed => {
        this.query = this.query.where(fields[1], 'LIKE', '%', +search + '%');
      // });
    }
    return this;
  }
}
