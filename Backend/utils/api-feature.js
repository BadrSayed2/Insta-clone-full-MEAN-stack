class ApiFeatures {
  constructor(mongooseQuery, queryString = {}, options = {}) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.paginationResult = null;

    // Default options that can be overridden
    this.options = {
      excludeFields: ["page", "sort", "limit", "fields", "keyword", "search"],
      defaultSort: "-createdAt",
      defaultLimit: 50,
      maxLimit: 500,
      defaultSelectExclusion: "-__v",
      caseSensitiveSearch: false,
      ...options,
    };
  }

  filter() {
    try {
      const queryStringObj = { ...this.queryString };

      // Remove pagination and utility fields
      this.options.excludeFields.forEach(
        (field) => delete queryStringObj[field]
      );
      console.log;
      let queryStr = JSON.stringify(queryStringObj);
      console.log("Original query string:", queryStr);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt|ne|in|nin|exists|regex)\b/g,
        (match) => `$${match}`
      );
      console.log("Filter query string:", queryStr);
      const parsedQuery = JSON.parse(queryStr);
      console.log("Parsed filter query:", parsedQuery);
      // Apply the filter to the query
      this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
    } catch (error) {
      console.warn("ApiFeatures filter error:", error.message);
      // Continue with unfiltered query rather than breaking
    }

    return this;
  }

  /**
   * Apply sorting with better defaults and validation
   */
  sort() {
    try {
      if (this.queryString.sort) {
        // Handle comma-separated sort fields: "name,-createdAt" -> "name -createdAt"
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
      } else {
        // Use configurable default sort
        this.mongooseQuery = this.mongooseQuery.sort(this.options.defaultSort);
      }
    } catch (error) {
      console.warn("ApiFeatures sort error:", error.message);
      // Fallback to default sort
      this.mongooseQuery = this.mongooseQuery.sort(this.options.defaultSort);
    }
    return this;
  }

  /**
   * Limit fields returned in the response
   */
  limitFields() {
    try {
      if (this.queryString.fields) {
        // Handle comma-separated fields: "name,email" -> "name email"
        const fields = this.queryString.fields.split(",").join(" ");
        this.mongooseQuery = this.mongooseQuery.select(fields);
      } else {
        // Use configurable default exclusion
        this.mongooseQuery = this.mongooseQuery.select(
          this.options.defaultSelectExclusion
        );
      }
    } catch (error) {
      console.warn("ApiFeatures limitFields error:", error.message);
      // Fallback to default exclusion
      this.mongooseQuery = this.mongooseQuery.select(
        this.options.defaultSelectExclusion
      );
    }
    return this;
  }

  /**
   */
  search(searchConfig = []) {
    try {
      // Determine keyword field name
      const keywordField = searchConfig.keyword || "keyword";
      const searchTerm = this.queryString[keywordField];

      if (!searchTerm) return this;

      let searchFields = [];
      let options = {
        caseSensitive: this.options.caseSensitiveSearch,
        exact: false,
      };

      // Handle different searchConfig formats
      if (Array.isArray(searchConfig)) {
        searchFields = searchConfig;
      } else if (typeof searchConfig === "object") {
        searchFields = searchConfig.fields || [];
        options = { ...options, ...searchConfig };
      }

      // If no fields specified, try common field names
      if (searchFields.length === 0) {
        searchFields = [
          "name",
          "title",
          "description",
          "content",
          "email",
          "username",
        ];
      }

      // Build search query
      let searchQuery = {};

      if (options.exact) {
        // Exact match search
        searchQuery.$or = searchFields.map((field) => ({
          [field]: options.caseSensitive
            ? searchTerm
            : { $regex: `^${searchTerm}$`, $options: "i" },
        }));
      } else {
        // Regex search (default)
        const regexOptions = options.caseSensitive ? "" : "i";
        searchQuery.$or = searchFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: regexOptions },
        }));
      }

      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    } catch (error) {
      console.warn("ApiFeatures search error:", error.message);
      // Continue without search rather than breaking
    }

    return this;
  }

  /**
   * Enhanced pagination with better validation and metadata
   */
  paginate(countDocuments = 0) {
    try {
      // Parse and validate pagination parameters
      let page = parseInt(this.queryString.page) || 1;
      let limit = parseInt(this.queryString.limit) || this.options.defaultLimit;

      // Ensure positive values
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(limit, this.options.maxLimit));

      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const totalPages = Math.ceil(countDocuments / limit);

      // Build pagination metadata
      const pagination = {
        currentPage: page,
        limit: limit,
        totalDocuments: countDocuments,
        totalPages: totalPages,
        hasNextPage: endIndex < countDocuments,
        hasPrevPage: skip > 0,
        nextPage: endIndex < countDocuments ? page + 1 : null,
        prevPage: skip > 0 ? page - 1 : null,
        startIndex: skip + 1,
        endIndex: Math.min(endIndex, countDocuments),
      };

      // Apply pagination to query
      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
      this.paginationResult = pagination;
    } catch (error) {
      console.warn("ApiFeatures paginate error:", error.message);
      // Apply basic pagination as fallback
      this.mongooseQuery = this.mongooseQuery.limit(this.options.defaultLimit);
      this.paginationResult = {
        currentPage: 1,
        limit: this.options.defaultLimit,
        totalDocuments: countDocuments,
        error: "Pagination error - using defaults",
      };
    }

    return this;
  }

  /**
   * Get the final query result
   */
  async execute() {
    try {
      return await this.mongooseQuery.exec();
    } catch (error) {
      console.error("ApiFeatures execute error:", error.message);
      throw error;
    }
  }

  /**
   * Get query metadata (useful for debugging)
   */
  getQueryInfo() {
    return {
      originalQuery: this.queryString,
      pagination: this.paginationResult,
      options: this.options,
    };
  }

  /**
   * Get count of filtered results (without pagination)
   */
  async getFilteredCount() {
    try {
      const countQuery = this.mongooseQuery.model.find(
        this.mongooseQuery.getQuery()
      );
      return await countQuery.countDocuments();
    } catch (error) {
      console.warn("ApiFeatures getFilteredCount error:", error.message);
      return 0;
    }
  }

  /**
   * Static method for quick usage
   */
  static async applyFeatures(
    mongooseQuery,
    queryString,
    searchConfig,
    options
  ) {
    const features = new ApiFeatures(mongooseQuery, queryString, options);

    // Apply filter and search first
    features.filter().search(searchConfig);

    // Now get total count AFTER applying filters and search
    const filteredQuery = mongooseQuery.model.find(
      features.mongooseQuery.getQuery()
    );
    const totalCount = await filteredQuery.countDocuments();

    // Continue with sort, limitFields, and paginate using the correct count
    return features.sort().limitFields().paginate(totalCount);
  }
}

module.exports = ApiFeatures;
