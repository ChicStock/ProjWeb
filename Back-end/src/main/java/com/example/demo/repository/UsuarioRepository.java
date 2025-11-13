package com.example.demo.repository;

import com.example.demo.model.StatusUsuario;
import com.example.demo.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    UsuarioModel findByEmail(String email);

    UserDetails findByNome(String nome);

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByTelefone(String telefone);

    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByCpfAndIdNot(String cpf, Long id);
    boolean existsByTelefoneAndIdNot(String telefone, Long id);

    List<UsuarioModel> findByStatus(StatusUsuario status);

    @Query("SELECT u FROM UsuarioModel u WHERE u.nome LIKE %:termo% OR u.sobrenome LIKE %:termo% OR u.email LIKE %:termo%")
    List<UsuarioModel> findByTermo(@Param("termo") String termo);
}
