import { faaslyApi } from ".";

export const getDatabases = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faaslyApi(await getAccessTokenSilently()).get("databases?workspace_id=" + currentWorkspace?.id);
}
export const getDatabase = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId }] = queryKey
  return faaslyApi(await getAccessTokenSilently()).get("databases/"+databaseId);
}

export const getTables = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId }] = queryKey
  return faaslyApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables");
}

export const getFields = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId, tableId }] = queryKey
  return faaslyApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables/"+tableId+"/fields");
}
export const getTable = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId, tableId }] = queryKey
  return faaslyApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables/"+tableId);
}
export const createTable = async (data: any, getAccessTokenSilently: any) => {
  return faaslyApi(await getAccessTokenSilently()).post("databases/"+data?.database_id+"/tables", {
      ...data,
  });
}
export const createDatabase = async (data: any, getAccessTokenSilently: any) => {
  return faaslyApi(await getAccessTokenSilently()).post("databases", {
      ...data,
  });
}