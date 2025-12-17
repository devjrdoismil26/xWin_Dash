"""
💻 CODE GENERATOR - CodeT5 & GPT-4 para Business Intelligence

Capacidades:
- Geração de código em múltiplas linguagens
- Análise e otimização de código existente
- Geração de scripts de automação
- Criação de APIs e integrações
- Geração de queries SQL
- Análise de performance de código
- Documentação automática
- Refatoração inteligente
"""

import torch
from transformers import (
    CodeT5Tokenizer, T5ForConditionalGeneration,
    AutoTokenizer, AutoModelForCausalLM
)
import openai
import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import ast
import re
from datetime import datetime
import subprocess
import tempfile
import os
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)

class CodeGenerationType(Enum):
    FUNCTION_GENERATION = "function_generation"
    API_CREATION = "api_creation"
    SQL_QUERY = "sql_query"
    AUTOMATION_SCRIPT = "automation_script"
    DATA_ANALYSIS = "data_analysis"
    WEB_SCRAPING = "web_scraping"
    INTEGRATION = "integration"
    OPTIMIZATION = "optimization"
    DOCUMENTATION = "documentation"
    REFACTORING = "refactoring"

class ProgrammingLanguage(Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    PHP = "php"
    SQL = "sql"
    BASH = "bash"
    HTML = "html"
    CSS = "css"
    JAVA = "java"
    GO = "go"

@dataclass
class CodeGenerationRequest:
    description: str
    language: ProgrammingLanguage
    generation_type: CodeGenerationType
    context: Optional[Dict[str, Any]] = None
    existing_code: Optional[str] = None
    requirements: Optional[List[str]] = None
    framework: Optional[str] = None

@dataclass
class CodeAnalysis:
    complexity_score: float
    performance_rating: str
    security_issues: List[str]
    best_practices: List[str]
    suggestions: List[str]
    dependencies: List[str]

@dataclass
class CodeGenerationResult:
    generated_code: str
    language: ProgrammingLanguage
    generation_type: CodeGenerationType
    explanation: str
    analysis: CodeAnalysis
    tests: Optional[str]
    documentation: str
    confidence_score: float
    metadata: Dict[str, Any]
    processing_time: float

class CodeGenerator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Inicializando CodeGenerator no device: {self.device}")
        
        # Carregar modelos
        self._load_models()
        
        # Cliente OpenAI para análises avançadas
        self.openai_client = openai.AsyncOpenAI()
        
        # Templates de código para diferentes linguagens
        self.templates = self._load_templates()

    def _load_models(self):
        """Carrega os modelos necessários"""
        try:
            # CodeT5 para geração de código
            self.codet5_tokenizer = CodeT5Tokenizer.from_pretrained("Salesforce/codet5-base")
            self.codet5_model = T5ForConditionalGeneration.from_pretrained("Salesforce/codet5-base")
            if self.device == "cuda":
                self.codet5_model = self.codet5_model.to(self.device)
            logger.info("✅ CodeT5 model carregado")
            
            # StarCoder para geração mais avançada
            try:
                self.starcoder_tokenizer = AutoTokenizer.from_pretrained("bigcode/starcoder")
                self.starcoder_model = AutoModelForCausalLM.from_pretrained(
                    "bigcode/starcoder",
                    torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
                )
                if self.device == "cuda":
                    self.starcoder_model = self.starcoder_model.to(self.device)
                logger.info("✅ StarCoder model carregado")
            except Exception as e:
                logger.warning(f"StarCoder não disponível: {e}")
                self.starcoder_model = None
                self.starcoder_tokenizer = None
            
        except Exception as e:
            logger.error(f"Erro ao carregar modelos: {e}")
            raise

    def _load_templates(self) -> Dict[str, Dict[str, str]]:
        """Carrega templates de código"""
        return {
            "python": {
                "function": '''def {function_name}({parameters}):
    """
    {description}
    
    Args:
        {args_doc}
    
    Returns:
        {return_doc}
    """
    {body}
    return {return_value}''',
                
                "class": '''class {class_name}:
    """
    {description}
    """
    
    def __init__(self{init_params}):
        {init_body}
    
    {methods}''',
                
                "api": '''from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="{api_name}")

{models}

{endpoints}''',
            },
            
            "javascript": {
                "function": '''/**
 * {description}
 * @param {{Object}} params - Parameters
 * @returns {{*}} {return_doc}
 */
function {function_name}({parameters}) {{
    {body}
    return {return_value};
}}''',
                
                "api": '''const express = require('express');
const app = express();

app.use(express.json());

{endpoints}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {{
    console.log(`Server running on port ${{PORT}}`);
}});''',
            },
            
            "php": {
                "function": '''<?php
/**
 * {description}
 * 
 * @param {param_types}
 * @return {return_type}
 */
function {function_name}({parameters}) {{
    {body}
    return {return_value};
}}''',
                
                "laravel_controller": '''<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class {controller_name} extends Controller
{{
    {methods}
}}''',
            }
        }

    async def generate(self, request: CodeGenerationRequest) -> CodeGenerationResult:
        """Gera código baseado na solicitação"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Escolher estratégia de geração
            if request.generation_type in [CodeGenerationType.FUNCTION_GENERATION, CodeGenerationType.API_CREATION]:
                generated_code = await self._generate_with_templates(request)
            else:
                generated_code = await self._generate_with_ai(request)
            
            # Analisar código gerado
            analysis = await self._analyze_code(generated_code, request.language)
            
            # Gerar testes
            tests = await self._generate_tests(generated_code, request.language) if request.generation_type != CodeGenerationType.SQL_QUERY else None
            
            # Gerar documentação
            documentation = await self._generate_documentation(generated_code, request)
            
            # Explicação
            explanation = await self._generate_explanation(generated_code, request)
            
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return CodeGenerationResult(
                generated_code=generated_code,
                language=request.language,
                generation_type=request.generation_type,
                explanation=explanation,
                analysis=analysis,
                tests=tests,
                documentation=documentation,
                confidence_score=await self._calculate_confidence(generated_code, request),
                metadata={
                    "models_used": ["CodeT5", "GPT-4"],
                    "device": self.device,
                    "framework": request.framework,
                    "lines_of_code": len(generated_code.split('\n'))
                },
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Erro na geração de código: {e}")
            raise

    async def _generate_with_templates(self, request: CodeGenerationRequest) -> str:
        """Gera código usando templates e IA"""
        try:
            # Usar GPT-4 para análise inicial
            prompt = f"""
            Analise esta solicitação de código e extraia informações estruturadas:
            
            Descrição: {request.description}
            Linguagem: {request.language.value}
            Tipo: {request.generation_type.value}
            Framework: {request.framework}
            
            Retorne JSON com:
            {{
                "function_name": "nome_da_funcao",
                "parameters": ["param1", "param2"],
                "return_type": "tipo_retorno",
                "main_logic": "lógica principal em pseudocódigo",
                "dependencies": ["lib1", "lib2"],
                "complexity": "baixa|média|alta"
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            structure = json.loads(response.choices[0].message.content)
            
            # Gerar código usando estrutura + template
            if request.generation_type == CodeGenerationType.FUNCTION_GENERATION:
                return await self._generate_function(request, structure)
            elif request.generation_type == CodeGenerationType.API_CREATION:
                return await self._generate_api(request, structure)
            else:
                return await self._generate_with_ai(request)
                
        except Exception as e:
            logger.error(f"Erro na geração com templates: {e}")
            return await self._generate_with_ai(request)

    async def _generate_function(self, request: CodeGenerationRequest, structure: Dict[str, Any]) -> str:
        """Gera função específica"""
        try:
            # Usar GPT-4 para gerar o corpo da função
            prompt = f"""
            Gere uma função {request.language.value} completa:
            
            Nome: {structure.get('function_name', 'process_data')}
            Parâmetros: {structure.get('parameters', [])}
            Lógica: {structure.get('main_logic', '')}
            Descrição: {request.description}
            
            Requisitos:
            - Código limpo e bem comentado
            - Tratamento de erros
            - Validação de entrada
            - Docstring/comentários adequados
            - Seguir boas práticas da linguagem
            
            Retorne apenas o código da função.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na geração de função: {e}")
            return f"# Erro na geração: {e}"

    async def _generate_api(self, request: CodeGenerationRequest, structure: Dict[str, Any]) -> str:
        """Gera API completa"""
        try:
            framework_map = {
                "python": "FastAPI",
                "javascript": "Express.js",
                "php": "Laravel"
            }
            
            framework = request.framework or framework_map.get(request.language.value, "padrão")
            
            prompt = f"""
            Crie uma API {framework} completa:
            
            Descrição: {request.description}
            Linguagem: {request.language.value}
            Framework: {framework}
            
            Requisitos:
            - Endpoints RESTful
            - Validação de dados
            - Tratamento de erros
            - Documentação inline
            - Middleware de segurança
            - Estrutura profissional
            
            Inclua pelo menos:
            - GET /items
            - POST /items
            - PUT /items/:id
            - DELETE /items/:id
            
            Retorne código completo pronto para executar.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na geração de API: {e}")
            return f"# Erro na geração: {e}"

    async def _generate_with_ai(self, request: CodeGenerationRequest) -> str:
        """Gera código usando modelos de IA"""
        try:
            # Preparar prompt baseado no tipo
            prompt = self._prepare_generation_prompt(request)
            
            # Tentar StarCoder primeiro (se disponível)
            if self.starcoder_model and request.language in [ProgrammingLanguage.PYTHON, ProgrammingLanguage.JAVASCRIPT]:
                return await self._generate_with_starcoder(prompt, request)
            else:
                return await self._generate_with_gpt4(prompt, request)
                
        except Exception as e:
            logger.error(f"Erro na geração com IA: {e}")
            return await self._generate_with_gpt4(prompt, request)

    def _prepare_generation_prompt(self, request: CodeGenerationRequest) -> str:
        """Prepara prompt específico para o tipo de geração"""
        base_prompt = f"""
        Linguagem: {request.language.value}
        Tipo: {request.generation_type.value}
        Descrição: {request.description}
        """
        
        if request.framework:
            base_prompt += f"\nFramework: {request.framework}"
        
        if request.requirements:
            base_prompt += f"\nRequisitos: {', '.join(request.requirements)}"
        
        if request.existing_code:
            base_prompt += f"\nCódigo existente:\n{request.existing_code}"
        
        # Prompts específicos por tipo
        type_prompts = {
            CodeGenerationType.SQL_QUERY: "Crie uma query SQL otimizada e segura.",
            CodeGenerationType.AUTOMATION_SCRIPT: "Crie um script de automação robusto com logging.",
            CodeGenerationType.DATA_ANALYSIS: "Crie código para análise de dados com visualizações.",
            CodeGenerationType.WEB_SCRAPING: "Crie um scraper respeitando robots.txt e rate limits.",
            CodeGenerationType.INTEGRATION: "Crie código de integração com APIs externas.",
            CodeGenerationType.OPTIMIZATION: "Otimize o código existente para melhor performance.",
            CodeGenerationType.REFACTORING: "Refatore o código seguindo melhores práticas."
        }
        
        specific_prompt = type_prompts.get(request.generation_type, "Crie código profissional e bem documentado.")
        
        return f"{base_prompt}\n\n{specific_prompt}"

    async def _generate_with_starcoder(self, prompt: str, request: CodeGenerationRequest) -> str:
        """Gera código usando StarCoder"""
        try:
            inputs = self.starcoder_tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.starcoder_model.generate(
                    **inputs,
                    max_new_tokens=500,
                    temperature=0.2,
                    do_sample=True,
                    pad_token_id=self.starcoder_tokenizer.eos_token_id
                )
            
            generated = self.starcoder_tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Limpar prompt do resultado
            if prompt in generated:
                generated = generated.replace(prompt, "").strip()
            
            return generated
            
        except Exception as e:
            logger.error(f"Erro com StarCoder: {e}")
            return await self._generate_with_gpt4(prompt, request)

    async def _generate_with_gpt4(self, prompt: str, request: CodeGenerationRequest) -> str:
        """Gera código usando GPT-4"""
        try:
            full_prompt = f"""
            {prompt}
            
            Requisitos adicionais:
            - Código limpo e bem comentado
            - Tratamento de erros adequado
            - Seguir convenções da linguagem
            - Incluir docstrings/comentários
            - Código pronto para produção
            
            Retorne apenas o código, sem explicações adicionais.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": full_prompt}],
                temperature=0.3,
                max_tokens=2000
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro com GPT-4: {e}")
            return f"# Erro na geração: {e}"

    async def _analyze_code(self, code: str, language: ProgrammingLanguage) -> CodeAnalysis:
        """Analisa qualidade do código gerado"""
        try:
            prompt = f"""
            Analise este código {language.value} e forneça métricas de qualidade:
            
            Código:
            {code}
            
            Retorne JSON com:
            {{
                "complexity_score": 0.0-10.0,
                "performance_rating": "excelente|boa|média|ruim",
                "security_issues": ["issue1", "issue2"],
                "best_practices": ["prática seguida 1", "prática seguida 2"],
                "suggestions": ["melhoria 1", "melhoria 2"],
                "dependencies": ["dep1", "dep2"]
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2
            )
            
            analysis_data = json.loads(response.choices[0].message.content)
            
            return CodeAnalysis(
                complexity_score=analysis_data.get("complexity_score", 5.0),
                performance_rating=analysis_data.get("performance_rating", "média"),
                security_issues=analysis_data.get("security_issues", []),
                best_practices=analysis_data.get("best_practices", []),
                suggestions=analysis_data.get("suggestions", []),
                dependencies=analysis_data.get("dependencies", [])
            )
            
        except Exception as e:
            logger.error(f"Erro na análise de código: {e}")
            return CodeAnalysis(
                complexity_score=5.0,
                performance_rating="média",
                security_issues=[],
                best_practices=[],
                suggestions=[],
                dependencies=[]
            )

    async def _generate_tests(self, code: str, language: ProgrammingLanguage) -> str:
        """Gera testes para o código"""
        try:
            test_frameworks = {
                ProgrammingLanguage.PYTHON: "pytest",
                ProgrammingLanguage.JAVASCRIPT: "Jest",
                ProgrammingLanguage.TYPESCRIPT: "Jest",
                ProgrammingLanguage.PHP: "PHPUnit",
                ProgrammingLanguage.JAVA: "JUnit"
            }
            
            framework = test_frameworks.get(language, "framework padrão")
            
            prompt = f"""
            Crie testes unitários para este código {language.value} usando {framework}:
            
            Código:
            {code}
            
            Requisitos:
            - Testes abrangentes (casos normais e edge cases)
            - Mocks quando necessário
            - Assertions claras
            - Estrutura profissional
            
            Retorne apenas o código dos testes.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na geração de testes: {e}")
            return f"# Erro na geração de testes: {e}"

    async def _generate_documentation(self, code: str, request: CodeGenerationRequest) -> str:
        """Gera documentação para o código"""
        try:
            prompt = f"""
            Crie documentação técnica para este código:
            
            Código: {code}
            Tipo: {request.generation_type.value}
            Linguagem: {request.language.value}
            
            Inclua:
            - Visão geral
            - Como usar
            - Parâmetros/configuração
            - Exemplos de uso
            - Dependências
            - Instalação/setup
            
            Use formato Markdown.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na geração de documentação: {e}")
            return f"# Erro na documentação: {e}"

    async def _generate_explanation(self, code: str, request: CodeGenerationRequest) -> str:
        """Gera explicação do código"""
        try:
            prompt = f"""
            Explique este código de forma clara e didática:
            
            {code}
            
            Foque em:
            - O que o código faz
            - Como funciona
            - Principais decisões técnicas
            - Pontos importantes para manutenção
            
            Seja conciso mas informativo.
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Erro na explicação: {e}")
            return "Explicação não disponível"

    async def _calculate_confidence(self, code: str, request: CodeGenerationRequest) -> float:
        """Calcula confiança na geração"""
        try:
            # Fatores de confiança
            factors = {
                "syntax_valid": 0.3,
                "has_error_handling": 0.2,
                "has_documentation": 0.2,
                "follows_conventions": 0.15,
                "completeness": 0.15
            }
            
            confidence = 0.5  # Base
            
            # Verificar sintaxe (para Python)
            if request.language == ProgrammingLanguage.PYTHON:
                try:
                    ast.parse(code)
                    confidence += factors["syntax_valid"]
                except:
                    pass
            
            # Verificar tratamento de erro
            error_keywords = ["try", "catch", "except", "error", "throw"]
            if any(keyword in code.lower() for keyword in error_keywords):
                confidence += factors["has_error_handling"]
            
            # Verificar documentação
            doc_keywords = ["def ", "/**", "'''", '"""', "//"]
            if any(keyword in code for keyword in doc_keywords):
                confidence += factors["has_documentation"]
            
            # Verificar convenções (camelCase, snake_case, etc.)
            if request.language == ProgrammingLanguage.PYTHON and "_" in code:
                confidence += factors["follows_conventions"]
            elif request.language == ProgrammingLanguage.JAVASCRIPT and re.search(r'[a-z][A-Z]', code):
                confidence += factors["follows_conventions"]
            
            # Verificar completude (função/classe completa)
            if len(code.split('\n')) > 5:
                confidence += factors["completeness"]
            
            return min(confidence, 1.0)
            
        except Exception as e:
            logger.error(f"Erro no cálculo de confiança: {e}")
            return 0.7

    async def optimize_code(self, code: str, language: ProgrammingLanguage) -> CodeGenerationResult:
        """Otimiza código existente"""
        request = CodeGenerationRequest(
            description="Otimizar código para melhor performance",
            language=language,
            generation_type=CodeGenerationType.OPTIMIZATION,
            existing_code=code
        )
        
        return await self.generate(request)

    async def refactor_code(self, code: str, language: ProgrammingLanguage) -> CodeGenerationResult:
        """Refatora código seguindo melhores práticas"""
        request = CodeGenerationRequest(
            description="Refatorar código seguindo melhores práticas",
            language=language,
            generation_type=CodeGenerationType.REFACTORING,
            existing_code=code
        )
        
        return await self.generate(request)

    async def batch_generate(self, requests: List[CodeGenerationRequest]) -> List[CodeGenerationResult]:
        """Geração em lote"""
        tasks = [self.generate(request) for request in requests]
        return await asyncio.gather(*tasks)

# Instância global
code_generator = CodeGenerator()