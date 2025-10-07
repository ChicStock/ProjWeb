package com.example.demo.repository;

import com.example.demo.model.StatusUsuario;
import com.example.demo.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    Optional<UsuarioModel> findByEmail(String email);
    Optional<UsuarioModel> findByCpf(String cpf);
    Optional<UsuarioModel> findByTelefone(String telefone);

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByTelefone(String telefone);
    boolean existsByTelefoneAndIdNot(String telefone, Long id);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByCpfAndIdNot(String cpf, Long id);

    // CORRIGIR ESTA QUERY - REMOVER O SOBRENOME
    @Query("SELECT u FROM UsuarioModel u WHERE u.nome LIKE :termo OR u.email LIKE :termo")
    List<UsuarioModel> findByTermo(@Param("termo") String termo);

    // Ou se você quiser manter mais campos:
    // @Query("SELECT u FROM UsuarioModel u WHERE u.nome LIKE :termo OR u.email LIKE :termo OR u.cpf LIKE :termo")
    // List<UsuarioModel> findByTermo(@Param("termo") String termo);

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    UserDetails findByNome(String nome);

    UserDetails findByEmail(String email);

    Optional<UsuarioModel> findByCpf(String cpf);

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByTelefone(String telefone);

    // Para validações em updates
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByCpfAndIdNot(String cpf, Long id);
    boolean existsByTelefoneAndIdNot(String telefone, Long id);

    List<UsuarioModel> findByStatus(StatusUsuario status);

    // Correção da Query - UsuarioModel em vez de Usuario
    @Query("SELECT u FROM UsuarioModel u WHERE u.nome LIKE %:termo% OR u.sobrenome LIKE %:termo% OR u.email LIKE %:termo%")
    List<UsuarioModel> findByTermo(String termo);
}
