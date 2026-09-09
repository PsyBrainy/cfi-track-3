# Gestión de Ramas Git — Guía Técnica

## 1. Estructura de ramas del proyecto

```
main                                → producción / versión estable
 └── dev                            → integración de features
      ├── feature/historia-de-usuarios
      └── feature/otra-historia-de-usuario
```

**Flujo general:**
1. `main` solo recibe merges desde `dev` cuando una versión está lista para producción.
2. `dev` es la rama de integración: ahí se juntan todas las features antes de pasar a `main`.
3. Cada `feature/*` se crea a partir de `dev`, se trabaja de forma aislada, y se integra de nuevo a `dev` mediante Pull Request (o merge directo si el equipo no usa PR).

---

## 2. Ver el estado de las ramas

```bash
# Listar ramas locales
git branch

# Listar ramas locales y remotas
git branch -a

# Ver en qué rama estoy parado
git status

# Traer info de ramas remotas nuevas (sin mezclar nada)
git fetch origin
```

---

## 3. Crear una nueva rama feature desde dev

```bash
# 1. Pararse en dev
git checkout dev

# 2. Actualizar dev con lo último del remoto
git pull origin dev

# 3. Crear la nueva rama feature a partir de dev
git checkout -b feature/nombre-de-la-historia

# (alternativa en un solo paso, git moderno)
git switch -c feature/nombre-de-la-historia dev
```

---

## 4. Trabajar y subir cambios a una rama feature

```bash
# Ver archivos modificados
git status

# Agregar cambios al staging
git add .
# o un archivo puntual
git add src/main/java/cfi/alkemy_cfi_alkywallet/Usuario.java

# Confirmar el commit
git commit -m "feat: agrega validación de email en registro de usuario"

# Primer push de una rama nueva (crea el tracking con el remoto)
git push -u origin feature/nombre-de-la-historia

# Pushes siguientes, ya con el tracking configurado
git push
```

> 💡 `-u` (`--set-upstream`) solo hace falta la primera vez que pusheás esa rama. Después alcanza con `git push`.

---

## 5. Traer los cambios de dev a mi rama feature (mantenerla actualizada)

Esto es importante hacerlo seguido, para evitar conflictos grandes al final.

### Opción A — Merge (más simple, conserva el historial real)
```bash
git checkout feature/historia-de-usuarios
git fetch origin
git merge origin/dev
```

### Opción B — Rebase (historial más lineal y prolijo)
```bash
git checkout feature/historia-de-usuarios
git fetch origin
git rebase origin/dev

# Si hay conflictos durante el rebase:
# 1. Resolver los archivos en conflicto
git add <archivo-resuelto>
git rebase --continue

# Si querés abortar el rebase:
git rebase --abort
```

> ⚠️ No hagas `rebase` sobre una rama que ya subiste y que otra persona también está usando, porque reescribe el historial. Para una rama personal de feature está bien.

Después de un rebase, si ya habías pusheado esa rama antes, el push necesita forzarse:
```bash
git push --force-with-lease
```
(`--force-with-lease` es más seguro que `--force` porque evita pisar commits ajenos que no viste.)

---

## 6. Resolver conflictos

```bash
# Al hacer merge o rebase, git marca los archivos en conflicto
git status

# Editar manualmente los archivos, buscando las marcas:
# <<<<<<< HEAD
# ...tu código...
# =======
# ...código de dev...
# >>>>>>> origin/dev

# Una vez resuelto:
git add <archivo-resuelto>

# Si estabas en un merge:
git commit

# Si estabas en un rebase:
git rebase --continue
```

---

## 7. Llevar una feature terminada a dev

**Recomendado: vía Pull Request en GitHub**
```bash
git checkout feature/historia-de-usuarios
git push
# Luego crear el PR desde GitHub: base = dev, compare = feature/historia-de-usuarios
```

**Alternativa: merge local directo (si el equipo lo permite)**
```bash
git checkout dev
git pull origin dev
git merge feature/historia-de-usuarios
git push origin dev
```

---

## 8. Cambiar entre ramas

```bash
git checkout dev
git checkout feature/otra-historia-de-usuario

# equivalente moderno
git switch dev
git switch feature/otra-historia-de-usuario
```

> Si tenés cambios sin commitear y querés cambiar de rama sin perderlos:
> ```bash
> git stash          # guarda los cambios temporalmente
> git checkout dev
> git stash pop      # los recupera en la rama actual
> ```

---

## 9. Borrar ramas ya integradas

```bash
# Borrar rama local (falla si no está mergeada)
git branch -d feature/historia-de-usuarios

# Forzar borrado local aunque no esté mergeada
git branch -D feature/historia-de-usuarios

# Borrar rama remota
git push origin --delete feature/historia-de-usuarios
```

---

## 10. Cheatsheet rápido

| Acción | Comando |
|---|---|
| Ver ramas | `git branch -a` |
| Crear feature desde dev | `git checkout dev && git pull && git checkout -b feature/x` |
| Subir rama nueva | `git push -u origin feature/x` |
| Subir cambios ya trackeados | `git push` |
| Traer cambios de dev (merge) | `git fetch origin && git merge origin/dev` |
| Traer cambios de dev (rebase) | `git fetch origin && git rebase origin/dev` |
| Cambiar de rama | `git switch nombre-rama` |
| Guardar cambios temporalmente | `git stash` / `git stash pop` |
| Borrar rama local | `git branch -d feature/x` |
| Borrar rama remota | `git push origin --delete feature/x` |

---

## 11. Buenas prácticas

- Nombrá las ramas con prefijo claro: `feature/`, `fix/`, `hotfix/`, seguido de la tarea o historia de usuario.
- Actualizá tu rama feature con `dev` frecuentemente para evitar conflictos grandes al final.
- Hacé commits chicos y descriptivos (ideal: [Conventional Commits](https://www.conventionalcommits.org/), ej: `feat:`, `fix:`, `refactor:`).
- Nunca hagas `push --force` sobre `main` o `dev`; solo en ramas propias de feature y con `--force-with-lease`.
- Antes de abrir un Pull Request, verificá que tu rama compile y los tests pasen.
