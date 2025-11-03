import useAuthStore from "@/stores/user.ts";

function useAuth() {
  const access = useAuthStore(state => state.access);

  const auth = (key: string) => access.includes(key);

  return {auth};
}

export default useAuth;