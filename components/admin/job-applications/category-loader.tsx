import React from "react";
import FilterByCategory from "./filter-by-category";
import { getJobs } from "@/actions/jobs/get-jobs";

const CategoryLoader = async () => {
  const jobs = await getJobs();

  const categories = jobs.map((j) => j.slug);

  return <FilterByCategory categories={categories} />;
};

export default CategoryLoader;
