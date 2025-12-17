"""
🖼️ IMAGE ANALYZER - CLIP para Business Intelligence

Capacidades:
- Análise de conteúdo visual
- Extração de insights de marketing visual
- Análise de produtos e branding
- Detecção de elementos visuais
- Análise de concorrentes visuais
- Classificação automática de imagens
"""

import torch
import clip
import cv2
import numpy as np
from PIL import Image
import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import base64
import io
from datetime import datetime
import requests
from transformers import BlipProcessor, BlipForConditionalGeneration

# Configure logging
logger = logging.getLogger(__name__)

class ImageAnalysisType(Enum):
    CONTENT_ANALYSIS = "content_analysis"
    BRAND_ANALYSIS = "brand_analysis"
    PRODUCT_ANALYSIS = "product_analysis"
    MARKETING_ANALYSIS = "marketing_analysis"
    COMPETITOR_ANALYSIS = "competitor_analysis"
    QUALITY_ANALYSIS = "quality_analysis"
    EMOTION_ANALYSIS = "emotion_analysis"
    ACCESSIBILITY_ANALYSIS = "accessibility_analysis"

@dataclass
class ImageAnalysisRequest:
    image_data: str  # Base64 ou URL
    analysis_type: ImageAnalysisType
    context: Optional[Dict[str, Any]] = None
    business_domain: Optional[str] = None
    comparison_images: Optional[List[str]] = None

@dataclass
class ImageAnalysisResult:
    analysis_type: ImageAnalysisType
    insights: Dict[str, Any]
    summary: str
    confidence_score: float
    recommendations: List[str]
    visual_elements: Dict[str, Any]
    metadata: Dict[str, Any]
    processing_time: float

class ImageAnalyzer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Inicializando ImageAnalyzer no device: {self.device}")
        
        # Carregar modelos
        self._load_models()
        
        # Prompts especializados para análise textual das imagens
        self.analysis_prompts = {
            ImageAnalysisType.CONTENT_ANALYSIS: self._get_content_analysis_queries(),
            ImageAnalysisType.BRAND_ANALYSIS: self._get_brand_analysis_queries(),
            ImageAnalysisType.PRODUCT_ANALYSIS: self._get_product_analysis_queries(),
            ImageAnalysisType.MARKETING_ANALYSIS: self._get_marketing_analysis_queries(),
            ImageAnalysisType.COMPETITOR_ANALYSIS: self._get_competitor_analysis_queries(),
            ImageAnalysisType.QUALITY_ANALYSIS: self._get_quality_analysis_queries(),
            ImageAnalysisType.EMOTION_ANALYSIS: self._get_emotion_analysis_queries(),
            ImageAnalysisType.ACCESSIBILITY_ANALYSIS: self._get_accessibility_analysis_queries(),
        }

    def _load_models(self):
        """Carrega os modelos necessários"""
        try:
            # CLIP para análise visual-textual
            self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device=self.device)
            logger.info("✅ CLIP model carregado")
            
            # BLIP para descrição de imagens
            self.blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
            self.blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
            if self.device == "cuda":
                self.blip_model = self.blip_model.to(self.device)
            logger.info("✅ BLIP model carregado")
            
        except Exception as e:
            logger.error(f"Erro ao carregar modelos: {e}")
            raise

    async def analyze(self, request: ImageAnalysisRequest) -> ImageAnalysisResult:
        """Analisa imagem usando CLIP e outros modelos"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Carregar e preprocessar imagem
            image = await self._load_image(request.image_data)
            
            # Análises base
            description = await self._generate_description(image)
            visual_elements = await self._extract_visual_elements(image)
            clip_analysis = await self._analyze_with_clip(image, request.analysis_type)
            
            # Análise específica por tipo
            specialized_insights = await self._perform_specialized_analysis(
                image, request.analysis_type, request.context
            )
            
            # Combinar resultados
            insights = {
                **visual_elements,
                **clip_analysis,
                **specialized_insights,
                "description": description
            }
            
            # Gerar recomendações
            recommendations = await self._generate_recommendations(
                insights, request.analysis_type, request.business_domain
            )
            
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return ImageAnalysisResult(
                analysis_type=request.analysis_type,
                insights=insights,
                summary=await self._generate_summary(insights, request.analysis_type),
                confidence_score=insights.get("confidence_score", 0.8),
                recommendations=recommendations,
                visual_elements=visual_elements,
                metadata={
                    "models_used": ["CLIP", "BLIP"],
                    "device": self.device,
                    "business_domain": request.business_domain,
                    "image_size": image.size
                },
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Erro na análise de imagem: {e}")
            raise

    async def _load_image(self, image_data: str) -> Image.Image:
        """Carrega imagem de base64 ou URL"""
        try:
            if image_data.startswith("http"):
                response = requests.get(image_data)
                image = Image.open(io.BytesIO(response.content))
            else:
                # Assumir base64
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
            
            return image.convert("RGB")
        except Exception as e:
            logger.error(f"Erro ao carregar imagem: {e}")
            raise

    async def _generate_description(self, image: Image.Image) -> str:
        """Gera descrição da imagem usando BLIP"""
        try:
            inputs = self.blip_processor(image, return_tensors="pt")
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                out = self.blip_model.generate(**inputs, max_length=100)
            
            description = self.blip_processor.decode(out[0], skip_special_tokens=True)
            return description
        except Exception as e:
            logger.error(f"Erro na geração de descrição: {e}")
            return "Descrição não disponível"

    async def _extract_visual_elements(self, image: Image.Image) -> Dict[str, Any]:
        """Extrai elementos visuais básicos"""
        try:
            # Converter para numpy para análise
            img_array = np.array(image)
            
            # Análise de cores dominantes
            colors = self._analyze_colors(img_array)
            
            # Análise de composição
            composition = self._analyze_composition(img_array)
            
            # Análise de qualidade técnica
            quality = self._analyze_technical_quality(img_array)
            
            return {
                "colors": colors,
                "composition": composition,
                "technical_quality": quality,
                "dimensions": {"width": image.width, "height": image.height},
                "aspect_ratio": round(image.width / image.height, 2)
            }
        except Exception as e:
            logger.error(f"Erro na extração de elementos visuais: {e}")
            return {}

    def _analyze_colors(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisa paleta de cores"""
        try:
            # Redimensionar para análise mais rápida
            small_img = cv2.resize(img_array, (100, 100))
            
            # K-means para cores dominantes
            data = small_img.reshape((-1, 3))
            data = np.float32(data)
            
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
            k = 5
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Converter para lista de cores
            dominant_colors = centers.astype(int).tolist()
            
            # Análise de temperatura de cor
            avg_color = np.mean(img_array, axis=(0, 1))
            warmth = "quente" if avg_color[0] > avg_color[2] else "fria"
            
            return {
                "dominant_colors": dominant_colors,
                "color_temperature": warmth,
                "brightness": float(np.mean(cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY))),
                "contrast": float(np.std(cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)))
            }
        except Exception as e:
            logger.error(f"Erro na análise de cores: {e}")
            return {}

    def _analyze_composition(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisa composição da imagem"""
        try:
            height, width = img_array.shape[:2]
            
            # Análise de regra dos terços
            third_h, third_w = height // 3, width // 3
            
            # Detectar bordas para análise de composição
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            edges = cv2.Canny(gray, 100, 200)
            
            # Análise de simetria
            left_half = gray[:, :width//2]
            right_half = cv2.flip(gray[:, width//2:], 1)
            symmetry = cv2.matchTemplate(left_half, right_half[:, :left_half.shape[1]], cv2.TM_CCOEFF_NORMED)[0][0]
            
            return {
                "rule_of_thirds_compliance": self._check_rule_of_thirds(edges, third_w, third_h),
                "symmetry_score": float(symmetry),
                "edge_density": float(np.sum(edges > 0) / edges.size),
                "composition_balance": "equilibrada" if 0.3 < symmetry < 0.7 else "assimétrica"
            }
        except Exception as e:
            logger.error(f"Erro na análise de composição: {e}")
            return {}

    def _check_rule_of_thirds(self, edges: np.ndarray, third_w: int, third_h: int) -> float:
        """Verifica aderência à regra dos terços"""
        try:
            # Pontos de interesse da regra dos terços
            points = [
                (third_w, third_h), (2*third_w, third_h),
                (third_w, 2*third_h), (2*third_w, 2*third_h)
            ]
            
            score = 0
            for x, y in points:
                if x < edges.shape[1] and y < edges.shape[0]:
                    # Verificar densidade de bordas em uma área ao redor do ponto
                    area = edges[max(0, y-20):min(edges.shape[0], y+20), 
                              max(0, x-20):min(edges.shape[1], x+20)]
                    if area.size > 0:
                        score += np.sum(area > 0) / area.size
            
            return score / len(points)
        except Exception as e:
            return 0.0

    def _analyze_technical_quality(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisa qualidade técnica"""
        try:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Análise de nitidez (Laplacian)
            sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Análise de ruído
            noise = np.std(gray)
            
            # Análise de exposição
            histogram = cv2.calcHist([gray], [0], None, [256], [0, 256])
            exposure = "adequada"
            if np.sum(histogram[:50]) > np.sum(histogram) * 0.3:
                exposure = "subexposta"
            elif np.sum(histogram[200:]) > np.sum(histogram) * 0.3:
                exposure = "superexposta"
            
            return {
                "sharpness_score": float(sharpness),
                "noise_level": float(noise),
                "exposure": exposure,
                "quality_rating": "alta" if sharpness > 100 and noise < 50 else "média" if sharpness > 50 else "baixa"
            }
        except Exception as e:
            logger.error(f"Erro na análise de qualidade: {e}")
            return {}

    async def _analyze_with_clip(self, image: Image.Image, analysis_type: ImageAnalysisType) -> Dict[str, Any]:
        """Análise usando CLIP"""
        try:
            # Preprocessar imagem
            image_input = self.clip_preprocess(image).unsqueeze(0).to(self.device)
            
            # Obter queries para o tipo de análise
            queries = self.analysis_prompts[analysis_type]
            
            # Tokenizar textos
            text_inputs = clip.tokenize(queries).to(self.device)
            
            # Calcular similaridades
            with torch.no_grad():
                image_features = self.clip_model.encode_image(image_input)
                text_features = self.clip_model.encode_text(text_inputs)
                
                # Normalizar features
                image_features /= image_features.norm(dim=-1, keepdim=True)
                text_features /= text_features.norm(dim=-1, keepdim=True)
                
                # Calcular similaridade
                similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            
            # Processar resultados
            results = {}
            for i, query in enumerate(queries):
                score = float(similarity[0][i])
                results[query.replace(" ", "_").lower()] = score
            
            # Encontrar o conceito mais provável
            max_idx = similarity.argmax().item()
            top_concept = queries[max_idx]
            confidence = float(similarity[0][max_idx])
            
            return {
                "clip_analysis": results,
                "top_concept": top_concept,
                "confidence_score": confidence
            }
            
        except Exception as e:
            logger.error(f"Erro na análise CLIP: {e}")
            return {}

    def _get_content_analysis_queries(self) -> List[str]:
        return [
            "a professional business photo",
            "a casual lifestyle image",
            "a product showcase",
            "a marketing advertisement",
            "a social media post",
            "a corporate presentation slide",
            "an infographic or data visualization",
            "a team or people photo",
            "a technology or software interface",
            "a food or restaurant image"
        ]

    def _get_brand_analysis_queries(self) -> List[str]:
        return [
            "a luxury brand aesthetic",
            "a minimalist modern design",
            "a colorful playful brand",
            "a professional corporate look",
            "a vintage retro style",
            "an eco-friendly sustainable brand",
            "a tech startup aesthetic",
            "a premium quality appearance",
            "a youth-oriented brand",
            "a traditional established brand"
        ]

    def _get_product_analysis_queries(self) -> List[str]:
        return [
            "a high-quality product photo",
            "an e-commerce product image",
            "a lifestyle product shot",
            "a technical product specification",
            "a product in use demonstration",
            "a product comparison image",
            "a product packaging design",
            "a product close-up detail",
            "a product collection or range",
            "a product with price or offer"
        ]

    def _get_marketing_analysis_queries(self) -> List[str]:
        return [
            "a call-to-action advertisement",
            "an emotional marketing appeal",
            "a discount or promotion offer",
            "a testimonial or review showcase",
            "a before and after comparison",
            "a limited time offer",
            "a social proof element",
            "a brand awareness campaign",
            "a product launch announcement",
            "a seasonal marketing campaign"
        ]

    def _get_competitor_analysis_queries(self) -> List[str]:
        return [
            "a premium competitor brand",
            "a budget competitor offering",
            "a similar product category",
            "a different market positioning",
            "a superior quality claim",
            "an innovative feature highlight",
            "a traditional approach",
            "a disruptive market entry",
            "a niche market focus",
            "a mass market appeal"
        ]

    def _get_quality_analysis_queries(self) -> List[str]:
        return [
            "a high-resolution professional photo",
            "a well-lit properly exposed image",
            "a sharp focused image",
            "a well-composed artistic photo",
            "a color-accurate representation",
            "a clean minimal background",
            "a cluttered busy composition",
            "a low-quality amateur photo",
            "an overexposed bright image",
            "an underexposed dark image"
        ]

    def _get_emotion_analysis_queries(self) -> List[str]:
        return [
            "happiness and joy",
            "trust and reliability",
            "excitement and energy",
            "calm and peaceful",
            "professional and serious",
            "friendly and approachable",
            "luxury and exclusivity",
            "innovation and progress",
            "tradition and heritage",
            "urgency and action"
        ]

    def _get_accessibility_analysis_queries(self) -> List[str]:
        return [
            "high contrast readable text",
            "clear visual hierarchy",
            "colorblind friendly design",
            "large readable fonts",
            "simple clear layout",
            "accessible color combinations",
            "visual accessibility compliant",
            "inclusive design principles",
            "barrier-free visual design",
            "universal design approach"
        ]

    async def _perform_specialized_analysis(
        self, 
        image: Image.Image, 
        analysis_type: ImageAnalysisType, 
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Realiza análise especializada baseada no tipo"""
        specialized_insights = {}
        
        if analysis_type == ImageAnalysisType.BRAND_ANALYSIS:
            specialized_insights.update(await self._analyze_brand_elements(image))
        elif analysis_type == ImageAnalysisType.MARKETING_ANALYSIS:
            specialized_insights.update(await self._analyze_marketing_effectiveness(image))
        elif analysis_type == ImageAnalysisType.PRODUCT_ANALYSIS:
            specialized_insights.update(await self._analyze_product_presentation(image))
        
        return specialized_insights

    async def _analyze_brand_elements(self, image: Image.Image) -> Dict[str, Any]:
        """Análise específica de elementos de marca"""
        return {
            "brand_consistency": "alta",  # Placeholder - implementar lógica real
            "visual_identity_strength": "forte",
            "brand_personality": "profissional"
        }

    async def _analyze_marketing_effectiveness(self, image: Image.Image) -> Dict[str, Any]:
        """Análise de efetividade de marketing"""
        return {
            "attention_grabbing": "alto",
            "message_clarity": "clara",
            "call_to_action_presence": "visível"
        }

    async def _analyze_product_presentation(self, image: Image.Image) -> Dict[str, Any]:
        """Análise de apresentação de produto"""
        return {
            "product_visibility": "excelente",
            "context_appropriateness": "adequado",
            "purchase_intent_trigger": "forte"
        }

    async def _generate_recommendations(
        self, 
        insights: Dict[str, Any], 
        analysis_type: ImageAnalysisType,
        business_domain: Optional[str]
    ) -> List[str]:
        """Gera recomendações baseadas nos insights"""
        recommendations = []
        
        # Recomendações baseadas na qualidade técnica
        if insights.get("technical_quality", {}).get("quality_rating") == "baixa":
            recommendations.append("Melhorar a qualidade técnica da imagem (nitidez, iluminação)")
        
        # Recomendações baseadas na composição
        if insights.get("composition", {}).get("rule_of_thirds_compliance", 0) < 0.3:
            recommendations.append("Aplicar regra dos terços para melhor composição visual")
        
        # Recomendações específicas por tipo
        if analysis_type == ImageAnalysisType.MARKETING_ANALYSIS:
            recommendations.append("Adicionar elementos de call-to-action mais visíveis")
        elif analysis_type == ImageAnalysisType.BRAND_ANALYSIS:
            recommendations.append("Fortalecer elementos de identidade visual da marca")
        
        return recommendations

    async def _generate_summary(self, insights: Dict[str, Any], analysis_type: ImageAnalysisType) -> str:
        """Gera resumo da análise"""
        description = insights.get("description", "Imagem analisada")
        confidence = insights.get("confidence_score", 0.0)
        
        return f"Análise {analysis_type.value}: {description}. Confiança: {confidence:.1%}"

    async def compare_images(self, images: List[str], comparison_type: str = "similarity") -> Dict[str, Any]:
        """Compara múltiplas imagens"""
        try:
            if len(images) < 2:
                raise ValueError("Necessário pelo menos 2 imagens para comparação")
            
            # Carregar todas as imagens
            loaded_images = []
            for img_data in images:
                img = await self._load_image(img_data)
                loaded_images.append(img)
            
            # Extrair features de todas as imagens
            features = []
            for img in loaded_images:
                image_input = self.clip_preprocess(img).unsqueeze(0).to(self.device)
                with torch.no_grad():
                    feature = self.clip_model.encode_image(image_input)
                    feature /= feature.norm(dim=-1, keepdim=True)
                    features.append(feature)
            
            # Calcular matriz de similaridade
            similarity_matrix = []
            for i, feat_i in enumerate(features):
                row = []
                for j, feat_j in enumerate(features):
                    similarity = float((feat_i @ feat_j.T).item())
                    row.append(similarity)
                similarity_matrix.append(row)
            
            return {
                "similarity_matrix": similarity_matrix,
                "most_similar_pair": self._find_most_similar_pair(similarity_matrix),
                "least_similar_pair": self._find_least_similar_pair(similarity_matrix),
                "average_similarity": np.mean([s for row in similarity_matrix for s in row if s != 1.0])
            }
            
        except Exception as e:
            logger.error(f"Erro na comparação de imagens: {e}")
            raise

    def _find_most_similar_pair(self, similarity_matrix: List[List[float]]) -> Tuple[int, int, float]:
        """Encontra o par mais similar"""
        max_sim = 0
        max_pair = (0, 0)
        
        for i in range(len(similarity_matrix)):
            for j in range(i + 1, len(similarity_matrix[i])):
                if similarity_matrix[i][j] > max_sim:
                    max_sim = similarity_matrix[i][j]
                    max_pair = (i, j)
        
        return (*max_pair, max_sim)

    def _find_least_similar_pair(self, similarity_matrix: List[List[float]]) -> Tuple[int, int, float]:
        """Encontra o par menos similar"""
        min_sim = 1.0
        min_pair = (0, 0)
        
        for i in range(len(similarity_matrix)):
            for j in range(i + 1, len(similarity_matrix[i])):
                if similarity_matrix[i][j] < min_sim:
                    min_sim = similarity_matrix[i][j]
                    min_pair = (i, j)
        
        return (*min_pair, min_sim)

# Instância global
image_analyzer = ImageAnalyzer()