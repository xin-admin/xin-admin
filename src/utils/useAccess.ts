import useAuthStore from "@/stores/user.ts";

function useAccess() {
  const access = useAuthStore(state => state.access);

  const auth = (key: string) => access.includes(key);

  return {auth};
}

export default useAccess;