package com.coachtool.app.domain.mapper.cell;

import com.coachtool.app.domain.dto.cell.CellDTO;
import com.coachtool.app.domain.entity.Cell;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CellMapper extends EntityMapper<CellDTO, Cell> {
    @Override
    Cell toEntity(CellDTO dto);

    @Override
    CellDTO toDto(Cell entity);

    @Override
    List<Cell> toEntity(List<CellDTO> dtoList);

    @Override
    List<CellDTO> toDto(List<Cell> entityList);
}
