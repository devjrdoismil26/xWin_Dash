"""
🎬 SCENE MANAGER - Sistema Avançado de Gerenciamento de Cenas

Capacidades:
- Criação de vídeos longos através de múltiplas cenas
- Transições inteligentes entre cenas
- Sincronização temporal
- Composição de cenas complexas
- Narrativa automática
"""

import asyncio
import logging
import time
import uuid
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path
import tempfile
import os

from .media_generator import MediaGenerator, MediaGenerationRequest, MediaType
from ..api.schemas import VideoQuality

logger = logging.getLogger("PyLab.SceneManager")

class SceneType(str, Enum):
    """Tipos de cena disponíveis"""
    INTRO = "intro"
    MAIN = "main"
    TRANSITION = "transition"
    OUTRO = "outro"
    CUSTOM = "custom"

class TransitionType(str, Enum):
    """Tipos de transição entre cenas"""
    CUT = "cut"                    # Corte direto
    FADE = "fade"                  # Fade in/out
    DISSOLVE = "dissolve"          # Dissolução
    SLIDE = "slide"                # Deslizamento
    ZOOM = "zoom"                  # Zoom in/out
    MORPH = "morph"                # Morphing entre cenas

class SceneStatus(str, Enum):
    """Status de uma cena"""
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class Scene:
    """Definição de uma cena individual"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str = ""
    duration: int = 10  # segundos
    scene_type: SceneType = SceneType.MAIN
    quality: VideoQuality = VideoQuality.HD
    fps: int = 24
    
    # Configurações específicas da cena
    style_prompts: List[str] = field(default_factory=list)
    negative_prompt: str = ""
    seed: Optional[int] = None
    
    # Metadados
    order: int = 0
    status: SceneStatus = SceneStatus.PENDING
    file_path: Optional[str] = None
    generation_time: Optional[float] = None
    error_message: Optional[str] = None
    
    # Configurações visuais
    camera_movement: Optional[str] = None  # "pan_left", "zoom_in", etc.
    lighting: Optional[str] = None         # "golden_hour", "dramatic", etc.
    mood: Optional[str] = None            # "peaceful", "intense", etc.

@dataclass
class SceneTransition:
    """Definição de transição entre cenas"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    from_scene_id: str
    to_scene_id: str
    transition_type: TransitionType = TransitionType.FADE
    duration: float = 1.0  # segundos
    
    # Parâmetros específicos da transição
    parameters: Dict[str, Any] = field(default_factory=dict)

@dataclass
class VideoProject:
    """Projeto de vídeo completo com múltiplas cenas"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "Untitled Video"
    description: str = ""
    
    # Configurações globais
    total_duration: int = 60  # segundos
    quality: VideoQuality = VideoQuality.HD
    fps: int = 24
    
    # Cenas e transições
    scenes: List[Scene] = field(default_factory=list)
    transitions: List[SceneTransition] = field(default_factory=list)
    
    # Metadados do projeto
    created_at: str = field(default_factory=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))
    status: str = "draft"
    final_video_path: Optional[str] = None

class SceneManager:
    """Gerenciador avançado de cenas para vídeos longos"""
    
    def __init__(self, media_generator: MediaGenerator):
        self.media_generator = media_generator
        self.active_projects = {}
        self.scene_templates = self._load_scene_templates()
        
        logger.info("🎬 Scene Manager inicializado")
    
    def _load_scene_templates(self) -> Dict[str, Dict[str, Any]]:
        """Carregar templates predefinidos de cenas"""
        return {
            "intro": {
                "duration": 5,
                "style_prompts": ["cinematic intro", "dramatic opening"],
                "camera_movement": "zoom_in",
                "lighting": "dramatic"
            },
            "main_action": {
                "duration": 15,
                "style_prompts": ["dynamic action", "engaging scene"],
                "camera_movement": "pan_right",
                "lighting": "natural"
            },
            "transition": {
                "duration": 3,
                "style_prompts": ["smooth transition", "connecting scene"],
                "camera_movement": "static",
                "lighting": "soft"
            },
            "outro": {
                "duration": 5,
                "style_prompts": ["satisfying conclusion", "memorable ending"],
                "camera_movement": "zoom_out",
                "lighting": "warm"
            }
        }
    
    async def create_project(self, title: str, description: str = "", **kwargs) -> VideoProject:
        """Criar novo projeto de vídeo"""
        project = VideoProject(
            title=title,
            description=description,
            **kwargs
        )
        
        self.active_projects[project.id] = project
        logger.info(f"📝 Projeto criado: {title} (ID: {project.id})")
        
        return project
    
    def add_scene(self, project_id: str, prompt: str, **scene_kwargs) -> Scene:
        """Adicionar cena ao projeto"""
        if project_id not in self.active_projects:
            raise ValueError(f"Projeto {project_id} não encontrado")
        
        project = self.active_projects[project_id]
        
        # Aplicar configurações globais se não especificadas
        scene_kwargs.setdefault('quality', project.quality)
        scene_kwargs.setdefault('fps', project.fps)
        scene_kwargs.setdefault('order', len(project.scenes))
        
        scene = Scene(prompt=prompt, **scene_kwargs)
        project.scenes.append(scene)
        
        logger.info(f"🎭 Cena adicionada ao projeto {project.title}: {prompt[:50]}...")
        return scene
    
    def add_scene_from_template(self, project_id: str, template_name: str, prompt: str, **overrides) -> Scene:
        """Adicionar cena usando template predefinido"""
        if template_name not in self.scene_templates:
            raise ValueError(f"Template '{template_name}' não encontrado")
        
        template = self.scene_templates[template_name].copy()
        template.update(overrides)
        
        return self.add_scene(project_id, prompt, **template)
    
    def add_transition(self, project_id: str, from_scene_id: str, to_scene_id: str, 
                      transition_type: TransitionType = TransitionType.FADE, **kwargs) -> SceneTransition:
        """Adicionar transição entre cenas"""
        if project_id not in self.active_projects:
            raise ValueError(f"Projeto {project_id} não encontrado")
        
        transition = SceneTransition(
            from_scene_id=from_scene_id,
            to_scene_id=to_scene_id,
            transition_type=transition_type,
            **kwargs
        )
        
        self.active_projects[project_id].transitions.append(transition)
        logger.info(f"🔄 Transição adicionada: {from_scene_id} -> {to_scene_id}")
        
        return transition
    
    async def generate_scene(self, project_id: str, scene_id: str) -> Scene:
        """Gerar uma cena específica"""
        project = self.active_projects[project_id]
        scene = next((s for s in project.scenes if s.id == scene_id), None)
        
        if not scene:
            raise ValueError(f"Cena {scene_id} não encontrada")
        
        logger.info(f"🎬 Gerando cena: {scene.prompt[:50]}...")
        scene.status = SceneStatus.GENERATING
        
        try:
            # Construir prompt aprimorado
            enhanced_prompt = self._enhance_scene_prompt(scene)
            
            # Criar request de geração
            request = MediaGenerationRequest(
                prompt=enhanced_prompt,
                media_type=MediaType.VIDEO,
                negative_prompt=scene.negative_prompt,
                duration=scene.duration,
                fps=scene.fps,
                quality=scene.quality.value,
                seed=scene.seed
            )
            
            start_time = time.time()
            result = await self.media_generator.generate(request)
            scene.generation_time = time.time() - start_time
            
            if result.file_data:
                # Salvar arquivo da cena
                scene.file_path = await self._save_scene_file(scene, result.file_data)
                scene.status = SceneStatus.COMPLETED
                logger.info(f"✅ Cena gerada com sucesso: {scene.file_path}")
            else:
                scene.status = SceneStatus.FAILED
                scene.error_message = result.error_message or "Falha na geração"
                
        except Exception as e:
            scene.status = SceneStatus.FAILED
            scene.error_message = str(e)
            logger.error(f"❌ Erro na geração da cena: {e}")
        
        return scene
    
    async def generate_all_scenes(self, project_id: str, parallel: bool = False) -> List[Scene]:
        """Gerar todas as cenas do projeto"""
        project = self.active_projects[project_id]
        pending_scenes = [s for s in project.scenes if s.status == SceneStatus.PENDING]
        
        logger.info(f"🎬 Gerando {len(pending_scenes)} cenas para '{project.title}'")
        
        if parallel and len(pending_scenes) <= 3:  # Limite para evitar sobrecarga
            # Geração paralela para projetos pequenos
            tasks = [self.generate_scene(project_id, scene.id) for scene in pending_scenes]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Processar resultados
            completed_scenes = []
            for result in results:
                if isinstance(result, Scene):
                    completed_scenes.append(result)
                else:
                    logger.error(f"Erro na geração paralela: {result}")
            
            return completed_scenes
        else:
            # Geração sequencial (recomendado para vídeos)
            completed_scenes = []
            for scene in pending_scenes:
                result = await self.generate_scene(project_id, scene.id)
                completed_scenes.append(result)
                
                # Pequena pausa entre cenas para gerenciamento de memória
                await asyncio.sleep(1)
            
            return completed_scenes
    
    def _enhance_scene_prompt(self, scene: Scene) -> str:
        """Aprimorar prompt da cena com configurações adicionais"""
        prompt_parts = [scene.prompt]
        
        # Adicionar prompts de estilo
        if scene.style_prompts:
            prompt_parts.extend(scene.style_prompts)
        
        # Adicionar configurações visuais
        if scene.camera_movement:
            prompt_parts.append(f"camera {scene.camera_movement}")
        
        if scene.lighting:
            prompt_parts.append(f"{scene.lighting} lighting")
        
        if scene.mood:
            prompt_parts.append(f"{scene.mood} mood")
        
        # Adicionar qualificadores baseados no tipo de cena
        scene_qualifiers = {
            SceneType.INTRO: ["opening scene", "establishing shot"],
            SceneType.OUTRO: ["closing scene", "final shot"],
            SceneType.TRANSITION: ["transitional scene", "connecting shot"],
            SceneType.MAIN: ["main action", "detailed scene"]
        }
        
        if scene.scene_type in scene_qualifiers:
            prompt_parts.extend(scene_qualifiers[scene.scene_type])
        
        # Adicionar qualificadores de qualidade
        prompt_parts.extend([
            "high quality", "cinematic", "professional video production",
            f"{scene.duration} seconds duration"
        ])
        
        return ", ".join(prompt_parts)
    
    async def _save_scene_file(self, scene: Scene, file_data: bytes) -> str:
        """Salvar arquivo de cena no disco"""
        # Criar diretório para o projeto se não existir
        scenes_dir = Path("scenes") / scene.id[:8]
        scenes_dir.mkdir(parents=True, exist_ok=True)
        
        # Salvar arquivo
        file_path = scenes_dir / f"scene_{scene.order:03d}_{scene.id[:8]}.mp4"
        
        with open(file_path, 'wb') as f:
            f.write(file_data)
        
        return str(file_path)
    
    async def compose_final_video(self, project_id: str) -> str:
        """Compor vídeo final com todas as cenas e transições"""
        project = self.active_projects[project_id]
        completed_scenes = [s for s in project.scenes if s.status == SceneStatus.COMPLETED]
        
        if not completed_scenes:
            raise ValueError("Nenhuma cena completada encontrada")
        
        logger.info(f"🎞️ Compondo vídeo final: {len(completed_scenes)} cenas")
        
        try:
            # Importar moviepy para composição
            from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip
            
            # Ordenar cenas por ordem
            completed_scenes.sort(key=lambda s: s.order)
            
            # Carregar clipes de vídeo
            clips = []
            for scene in completed_scenes:
                if scene.file_path and os.path.exists(scene.file_path):
                    clip = VideoFileClip(scene.file_path)
                    
                    # Aplicar transições se definidas
                    clip = await self._apply_scene_transitions(project, scene, clip)
                    
                    clips.append(clip)
                    logger.info(f"📹 Cena adicionada: {scene.prompt[:30]}... ({clip.duration}s)")
            
            if not clips:
                raise ValueError("Nenhum clipe válido encontrado")
            
            # Concatenar todas as cenas
            logger.info("🔗 Concatenando cenas...")
            final_clip = concatenate_videoclips(clips, method="compose")
            
            # Salvar vídeo final
            output_path = f"final_videos/project_{project.id[:8]}_{int(time.time())}.mp4"
            os.makedirs("final_videos", exist_ok=True)
            
            logger.info(f"💾 Salvando vídeo final: {output_path}")
            final_clip.write_videofile(
                output_path,
                codec='libx264',
                audio=False,
                bitrate="8000k",
                verbose=False,
                logger=None,
                preset='medium'
            )
            
            # Limpar recursos
            for clip in clips:
                clip.close()
            final_clip.close()
            
            # Atualizar projeto
            project.final_video_path = output_path
            project.status = "completed"
            
            logger.info(f"✅ Vídeo final criado: {output_path}")
            return output_path
            
        except ImportError:
            logger.error("❌ MoviePy não disponível para composição")
            raise Exception("MoviePy é necessário para composição de vídeo")
        except Exception as e:
            logger.error(f"❌ Erro na composição: {e}")
            raise
    
    async def _apply_scene_transitions(self, project: VideoProject, scene: Scene, clip) -> Any:
        """Aplicar transições à cena"""
        # Encontrar transições que afetam esta cena
        incoming_transitions = [t for t in project.transitions if t.to_scene_id == scene.id]
        outgoing_transitions = [t for t in project.transitions if t.from_scene_id == scene.id]
        
        # Aplicar efeitos de transição (implementação simplificada)
        for transition in incoming_transitions:
            if transition.transition_type == TransitionType.FADE:
                clip = clip.fadein(transition.duration)
        
        for transition in outgoing_transitions:
            if transition.transition_type == TransitionType.FADE:
                clip = clip.fadeout(transition.duration)
        
        return clip
    
    def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """Obter status detalhado do projeto"""
        if project_id not in self.active_projects:
            return {"error": "Projeto não encontrado"}
        
        project = self.active_projects[project_id]
        
        scene_stats = {
            "total": len(project.scenes),
            "pending": len([s for s in project.scenes if s.status == SceneStatus.PENDING]),
            "generating": len([s for s in project.scenes if s.status == SceneStatus.GENERATING]),
            "completed": len([s for s in project.scenes if s.status == SceneStatus.COMPLETED]),
            "failed": len([s for s in project.scenes if s.status == SceneStatus.FAILED])
        }
        
        return {
            "project_id": project.id,
            "title": project.title,
            "status": project.status,
            "total_duration": project.total_duration,
            "scene_stats": scene_stats,
            "transitions": len(project.transitions),
            "final_video": project.final_video_path,
            "created_at": project.created_at
        }
    
    def create_story_template(self, project_id: str, story_type: str = "basic") -> List[Scene]:
        """Criar template de história automático"""
        project = self.active_projects[project_id]
        
        story_templates = {
            "basic": [
                {"type": "intro", "prompt": "Opening scene", "duration": 5},
                {"type": "main", "prompt": "Main content", "duration": 20},
                {"type": "outro", "prompt": "Closing scene", "duration": 5}
            ],
            "narrative": [
                {"type": "intro", "prompt": "Story introduction", "duration": 8},
                {"type": "main", "prompt": "Character development", "duration": 15},
                {"type": "main", "prompt": "Conflict or challenge", "duration": 12},
                {"type": "main", "prompt": "Resolution", "duration": 10},
                {"type": "outro", "prompt": "Story conclusion", "duration": 5}
            ],
            "showcase": [
                {"type": "intro", "prompt": "Product introduction", "duration": 6},
                {"type": "main", "prompt": "Feature demonstration", "duration": 18},
                {"type": "main", "prompt": "Benefits highlight", "duration": 12},
                {"type": "outro", "prompt": "Call to action", "duration": 4}
            ]
        }
        
        if story_type not in story_templates:
            story_type = "basic"
        
        template = story_templates[story_type]
        scenes = []
        
        for i, scene_def in enumerate(template):
            scene = self.add_scene_from_template(
                project_id, 
                scene_def["type"], 
                scene_def["prompt"],
                duration=scene_def["duration"],
                order=i
            )
            scenes.append(scene)
        
        logger.info(f"📚 Template '{story_type}' aplicado: {len(scenes)} cenas criadas")
        return scenes
    
    def cleanup_project(self, project_id: str):
        """Limpar recursos do projeto"""
        if project_id in self.active_projects:
            project = self.active_projects[project_id]
            
            # Remover arquivos de cena
            for scene in project.scenes:
                if scene.file_path and os.path.exists(scene.file_path):
                    try:
                        os.remove(scene.file_path)
                    except:
                        pass
            
            # Remover projeto da memória
            del self.active_projects[project_id]
            logger.info(f"🧹 Projeto {project.title} limpo")

# Instância global
scene_manager = SceneManager(media_generator=None)  # Será injetado posteriormente

# Funções de conveniência
async def create_long_video(title: str, scenes_data: List[Dict[str, Any]], **project_kwargs) -> str:
    """Função de conveniência para criar vídeo longo"""
    from .media_generator import media_generator
    
    # Injetar media_generator se não estiver configurado
    if scene_manager.media_generator is None:
        scene_manager.media_generator = media_generator
    
    # Criar projeto
    project = await scene_manager.create_project(title, **project_kwargs)
    
    # Adicionar cenas
    for scene_data in scenes_data:
        scene_manager.add_scene(project.id, **scene_data)
    
    # Gerar todas as cenas
    await scene_manager.generate_all_scenes(project.id)
    
    # Compor vídeo final
    final_video = await scene_manager.compose_final_video(project.id)
    
    return final_video

# Teste do sistema
async def test_scene_manager():
    """Teste do gerenciador de cenas"""
    from .media_generator import media_generator
    
    # Configurar dependência
    scene_manager.media_generator = media_generator
    
    # Criar projeto de teste
    project = await scene_manager.create_project(
        "Vídeo de Teste",
        description="Teste do sistema de cenas",
        total_duration=30
    )
    
    # Adicionar cenas usando template
    scenes = scene_manager.create_story_template(project.id, "basic")
    
    # Personalizar prompts
    scenes[0].prompt = "A beautiful sunrise over mountains"
    scenes[1].prompt = "A peaceful lake with swans swimming"
    scenes[2].prompt = "A sunset with birds flying home"
    
    logger.info(f"🧪 Projeto de teste criado: {len(scenes)} cenas")
    return project

if __name__ == "__main__":
    asyncio.run(test_scene_manager())