-- Trigger robusto para criação de perfil em novos usuários (e-mail/senha E OAuth)
-- Lida com usuários Google que não têm CPF, tipo nem data de nascimento nos metadados

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nome TEXT;
  v_tipo TEXT;
  v_cpf TEXT;
  v_data_nascimento TEXT;
  v_provider TEXT;
BEGIN
  -- Detecta o provedor de autenticação
  v_provider := NEW.raw_app_meta_data->>'provider';

  -- Extrai nome: tenta metadata de OAuth (Google) ou metadata de cadastro manual
  v_nome := COALESCE(
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Tipo de perfil: usa o que foi passado no cadastro manual, ou 'atleta' como padrão
  -- (A plataforma web sobrescreve para 'personal' no callback de OAuth se necessário)
  v_tipo := COALESCE(NEW.raw_user_meta_data->>'tipo', 'atleta');

  -- CPF e data de nascimento: apenas no cadastro manual
  v_cpf             := NEW.raw_user_meta_data->>'cpf';
  v_data_nascimento := NEW.raw_user_meta_data->>'data_nascimento';

  INSERT INTO public.profiles (id, nome, tipo, cpf, data_nascimento)
  VALUES (
    NEW.id,
    v_nome,
    v_tipo,
    v_cpf,
    v_data_nascimento::DATE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Nunca falha silenciosamente — loga o erro mas não bloqueia o cadastro
    RAISE WARNING 'handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Cria o trigger se ainda não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS
  'Cria perfil automaticamente para novos usuários (email/senha e OAuth/Google).
   Usuários Google recebem tipo=atleta por padrão; a plataforma web pode sobrescrever para personal.';
