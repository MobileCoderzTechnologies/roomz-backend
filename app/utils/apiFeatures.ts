
export class ApiFeatures {
  query: any;
  queryString: any;
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const deletedFields = ['sort', 'page', 'pageSize', 'search'];

    deletedFields.forEach(item => delete queryObj[item]);

    for (const key in queryObj) {
      if (typeof queryObj[key] === 'string') {
        this.query = this.query.where(key, queryObj[key]);
      }

      if (typeof queryObj[key] === 'object') {
        const logical = Object.keys(queryObj[key])[0];
        const logicalValue = Object.values(queryObj[key])[0];
        this.query = this.query.where(key, logical, logicalValue);
      }
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.pageSize * 1 || 10;
    this.query = this.query.paginate(page, limit);
    return this;
  }

  sorting(defaultSort: string, sortOrder: 'desc' | 'asc' = 'desc') {
    if (this.queryString.sort) {
      let sort = this.queryString.sort;
      if (sort.startsWith('-')) {
        sort = sort.replace('-', '');
        this.query = this.query.orderBy(sort, 'desc');
      } else {
        this.query = this.query.orderBy(sort, 'asc');
      }
    } else {
      this.query = this.query.orderBy(defaultSort, sortOrder);
    }
    return this;

  }


  searching(fields: String[]) {
    console.log('search')
    if (this.queryString.search) {
      const search = this.queryString.search;
      let searchQuery = `${fields[0]} LIKE '%${search}%'`;
      if (fields.length > 1) {
        for (let i = 1; i < fields.length; i++) {
          searchQuery += ` OR ${fields[i]} LIKE '%${search}%'`;
        }
      }
      this.query = this.query.whereRaw(searchQuery);
    }
    return this;
  }
}
