"""
🤖 PyLab - Storage Manager
Gerenciamento de arquivos de mídia gerados
"""

import os
import asyncio
import aiofiles
from pathlib import Path
import hashlib
import time
import logging
from typing import Optional, Dict, Any
from PIL import Image
import io

logger = logging.getLogger("PyLab.Storage")

class StorageManager:
    """Gerenciador de storage para arquivos de mídia"""
    
    def __init__(self, base_path: str = "/var/shared_media"):
        self.base_path = Path(base_path)
        self.image_path = self.base_path / "images"
        self.video_path = self.base_path / "videos"
        self.temp_path = self.base_path / "temp"
        
        # Criar diretórios se não existirem
        self._ensure_directories()
        
        logger.info(f"Storage Manager inicializado: {base_path}")
    
    def _ensure_directories(self):
        """Garantir que os diretórios existem"""
        for path in [self.base_path, self.image_path, self.video_path, self.temp_path]:
            path.mkdir(parents=True, exist_ok=True)
            # Garantir permissões de escrita
            os.chmod(path, 0o777)
    
    async def save_image(
        self, 
        image_data: bytes, 
        filename: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Salvar imagem no storage compartilhado
        
        Args:
            image_data: Dados da imagem em bytes
            filename: Nome do arquivo (será gerado se None)
            metadata: Metadados adicionais
            
        Returns:
            Nome do arquivo salvo
        """
        try:
            # Gerar filename se não fornecido
            if filename is None:
                timestamp = int(time.time())
                hash_obj = hashlib.md5(image_data)
                file_hash = hash_obj.hexdigest()[:8]
                filename = f"img_{timestamp}_{file_hash}.png"
            
            # Caminho completo
            file_path = self.image_path / filename
            
            # Salvar arquivo
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(image_data)
            
            # Verificar e otimizar imagem
            await self._optimize_image(file_path)
            
            # Salvar metadados se fornecidos
            if metadata:
                await self._save_metadata(file_path, metadata)
            
            logger.info(f"Imagem salva: {filename} ({len(image_data)} bytes)")
            return filename
            
        except Exception as e:
            logger.error(f"Erro ao salvar imagem: {e}")
            raise
    
    async def save_video(
        self, 
        video_data: bytes, 
        filename: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Salvar vídeo no storage compartilhado
        
        Args:
            video_data: Dados do vídeo em bytes
            filename: Nome do arquivo (será gerado se None)
            metadata: Metadados adicionais
            
        Returns:
            Nome do arquivo salvo
        """
        try:
            # Gerar filename se não fornecido
            if filename is None:
                timestamp = int(time.time())
                hash_obj = hashlib.md5(video_data)
                file_hash = hash_obj.hexdigest()[:8]
                filename = f"vid_{timestamp}_{file_hash}.mp4"
            
            # Caminho completo
            file_path = self.video_path / filename
            
            # Salvar arquivo
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(video_data)
            
            # Salvar metadados se fornecidos
            if metadata:
                await self._save_metadata(file_path, metadata)
            
            logger.info(f"Vídeo salvo: {filename} ({len(video_data)} bytes)")
            return filename
            
        except Exception as e:
            logger.error(f"Erro ao salvar vídeo: {e}")
            raise
    
    async def get_file_info(self, filename: str) -> Optional[Dict[str, Any]]:
        """
        Obter informações de um arquivo
        
        Args:
            filename: Nome do arquivo
            
        Returns:
            Dicionário com informações do arquivo
        """
        try:
            # Procurar arquivo nos diretórios
            for path in [self.image_path, self.video_path]:
                file_path = path / filename
                if file_path.exists():
                    stat = file_path.stat()
                    
                    # Determinar tipo
                    media_type = "image" if file_path.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif'] else "video"
                    
                    # Carregar metadados se existirem
                    metadata = await self._load_metadata(file_path)
                    
                    return {
                        "filename": filename,
                        "path": str(file_path),
                        "size": stat.st_size,
                        "created": stat.st_ctime,
                        "modified": stat.st_mtime,
                        "media_type": media_type,
                        "metadata": metadata
                    }
            
            return None
            
        except Exception as e:
            logger.error(f"Erro ao obter info do arquivo {filename}: {e}")
            return None
    
    async def delete_file(self, filename: str) -> bool:
        """
        Deletar arquivo do storage
        
        Args:
            filename: Nome do arquivo
            
        Returns:
            True se deletado com sucesso
        """
        try:
            deleted = False
            
            # Procurar e deletar arquivo
            for path in [self.image_path, self.video_path, self.temp_path]:
                file_path = path / filename
                if file_path.exists():
                    file_path.unlink()
                    deleted = True
                    
                    # Deletar metadados também
                    metadata_path = file_path.with_suffix('.json')
                    if metadata_path.exists():
                        metadata_path.unlink()
            
            if deleted:
                logger.info(f"Arquivo deletado: {filename}")
            
            return deleted
            
        except Exception as e:
            logger.error(f"Erro ao deletar arquivo {filename}: {e}")
            return False
    
    async def cleanup_old_files(self, max_age_hours: int = 24) -> int:
        """
        Limpar arquivos antigos
        
        Args:
            max_age_hours: Idade máxima em horas
            
        Returns:
            Número de arquivos deletados
        """
        try:
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            deleted_count = 0
            
            # Limpar cada diretório
            for path in [self.image_path, self.video_path, self.temp_path]:
                for file_path in path.iterdir():
                    if file_path.is_file():
                        file_age = current_time - file_path.stat().st_mtime
                        
                        if file_age > max_age_seconds:
                            file_path.unlink()
                            deleted_count += 1
                            
                            # Deletar metadados também
                            metadata_path = file_path.with_suffix('.json')
                            if metadata_path.exists():
                                metadata_path.unlink()
            
            logger.info(f"Limpeza: {deleted_count} arquivos antigos removidos")
            return deleted_count
            
        except Exception as e:
            logger.error(f"Erro na limpeza de arquivos: {e}")
            return 0
    
    async def get_storage_stats(self) -> Dict[str, Any]:
        """
        Obter estatísticas do storage
        
        Returns:
            Dicionário com estatísticas
        """
        try:
            stats = {
                "total_files": 0,
                "total_size": 0,
                "images": {"count": 0, "size": 0},
                "videos": {"count": 0, "size": 0},
                "temp": {"count": 0, "size": 0}
            }
            
            # Contar arquivos e tamanhos
            for name, path in [
                ("images", self.image_path),
                ("videos", self.video_path),
                ("temp", self.temp_path)
            ]:
                for file_path in path.iterdir():
                    if file_path.is_file() and not file_path.suffix == '.json':
                        file_size = file_path.stat().st_size
                        stats[name]["count"] += 1
                        stats[name]["size"] += file_size
                        stats["total_files"] += 1
                        stats["total_size"] += file_size
            
            return stats
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas: {e}")
            return {}
    
    # === MÉTODOS PRIVADOS ===
    
    async def _optimize_image(self, file_path: Path):
        """Otimizar imagem (reduzir tamanho se necessário)"""
        try:
            # Verificar tamanho do arquivo
            file_size = file_path.stat().st_size
            max_size = 10 * 1024 * 1024  # 10MB
            
            if file_size > max_size:
                # Reduzir qualidade/tamanho
                with Image.open(file_path) as img:
                    # Reduzir para máximo 2048x2048
                    if img.width > 2048 or img.height > 2048:
                        img.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
                    
                    # Salvar com qualidade reduzida
                    img.save(file_path, optimize=True, quality=85)
                
                logger.info(f"Imagem otimizada: {file_path.name}")
                
        except Exception as e:
            logger.warning(f"Erro ao otimizar imagem {file_path}: {e}")
    
    async def _save_metadata(self, file_path: Path, metadata: Dict[str, Any]):
        """Salvar metadados como arquivo JSON"""
        try:
            import json
            metadata_path = file_path.with_suffix('.json')
            
            # Adicionar timestamp
            metadata['saved_at'] = time.time()
            
            async with aiofiles.open(metadata_path, 'w') as f:
                await f.write(json.dumps(metadata, indent=2))
                
        except Exception as e:
            logger.warning(f"Erro ao salvar metadados: {e}")
    
    async def _load_metadata(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Carregar metadados do arquivo JSON"""
        try:
            import json
            metadata_path = file_path.with_suffix('.json')
            
            if metadata_path.exists():
                async with aiofiles.open(metadata_path, 'r') as f:
                    content = await f.read()
                    return json.loads(content)
            
            return None
            
        except Exception as e:
            logger.warning(f"Erro ao carregar metadados: {e}")
            return None
    
    def get_file_url(self, filename: str) -> str:
        """
        Obter URL pública do arquivo
        
        Args:
            filename: Nome do arquivo
            
        Returns:
            URL pública do arquivo
        """
        return f"/storage/media/{filename}"
    
    def get_file_path(self, filename: str) -> Optional[Path]:
        """
        Obter caminho completo do arquivo
        
        Args:
            filename: Nome do arquivo
            
        Returns:
            Path do arquivo se existir
        """
        for path in [self.image_path, self.video_path]:
            file_path = path / filename
            if file_path.exists():
                return file_path
        return None