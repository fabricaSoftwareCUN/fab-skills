#!/usr/bin/env bash
# validate.sh - Valida la estructura de skills en el repositorio fab-skills.
# Uso: bash scripts/validate.sh [directorio_raiz]
# Sin argumentos usa el directorio padre de scripts/.

set -euo pipefail

# --- Configuracion ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${1:-$(dirname "$SCRIPT_DIR")}"
SKIP_DIRS=("_template" ".git" "scripts" "node_modules" "dist" "build")
REQUIRED_FIELDS=("name" "description")

# --- Colores ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# --- Funciones ---

# Verifica si un directorio debe omitirse.
should_skip() {
  local dir_name="$1"
  for skip in "${SKIP_DIRS[@]}"; do
    [[ "$dir_name" == "$skip" ]] && return 0
  done
  return 1
}

# Extrae el bloque frontmatter de un archivo SKILL.md.
# Retorna el contenido entre los delimitadores ---.
extract_frontmatter() {
  local file="$1"
  sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d'
}

# Extrae el valor de un campo YAML simple (clave: valor).
get_field() {
  local frontmatter="$1"
  local field="$2"
  echo "$frontmatter" | grep -E "^${field}:" | sed "s/^${field}:[[:space:]]*//"
}

# --- Principal ---

errors=0
skills_found=0

echo -e "${YELLOW}Validando skills en: ${ROOT_DIR}${NC}"
echo "---"

for dir in "$ROOT_DIR"/*/; do
  # Saltar si no es directorio
  [[ ! -d "$dir" ]] && continue

  dir_name="$(basename "$dir")"

  # Saltar directorios excluidos
  should_skip "$dir_name" && continue

  skills_found=$((skills_found + 1))
  skill_errors=0

  echo -e "\nSkill: ${dir_name}"

  # 1. Verificar existencia de SKILL.md
  skill_file="${dir}SKILL.md"
  if [[ ! -f "$skill_file" ]]; then
    echo -e "  ${RED}[ERROR] Falta SKILL.md${NC}"
    errors=$((errors + 1))
    continue
  fi

  # 2. Verificar frontmatter YAML
  frontmatter_count=$(grep -c '^---$' "$skill_file" || true)
  if [[ "$frontmatter_count" -lt 2 ]]; then
    echo -e "  ${RED}[ERROR] Frontmatter YAML ausente o incompleto (requiere delimitadores ---)${NC}"
    errors=$((errors + 1))
    continue
  fi

  frontmatter="$(extract_frontmatter "$skill_file")"

  # 3. Verificar campos obligatorios
  for field in "${REQUIRED_FIELDS[@]}"; do
    value="$(get_field "$frontmatter" "$field")"
    if [[ -z "$value" ]]; then
      echo -e "  ${RED}[ERROR] Campo '${field}' ausente o vacio en frontmatter${NC}"
      skill_errors=$((skill_errors + 1))
    fi
  done

  # 4. Verificar coincidencia de nombre
  fm_name="$(get_field "$frontmatter" "name")"
  if [[ -n "$fm_name" && "$fm_name" != "$dir_name" ]]; then
    echo -e "  ${RED}[ERROR] Campo 'name' (${fm_name}) no coincide con carpeta (${dir_name})${NC}"
    skill_errors=$((skill_errors + 1))
  fi

  if [[ "$skill_errors" -eq 0 ]]; then
    echo -e "  ${GREEN}[OK]${NC}"
  fi

  errors=$((errors + skill_errors))
done

# --- Resumen ---
echo ""
echo "---"
echo -e "Skills analizadas: ${skills_found}"

if [[ "$skills_found" -eq 0 ]]; then
  echo -e "${YELLOW}No se encontraron skills para validar.${NC}"
  exit 0
fi

if [[ "$errors" -eq 0 ]]; then
  echo -e "${GREEN}Validacion exitosa. 0 errores.${NC}"
  exit 0
else
  echo -e "${RED}Validacion fallida. ${errors} error(es) encontrado(s).${NC}"
  exit 1
fi
